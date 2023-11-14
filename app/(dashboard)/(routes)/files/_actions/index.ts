"use server"
import { DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, _Object } from "@aws-sdk/client-s3"
import client from "@/lib/s3client"
import { extractRightOfSlash } from "@/lib/utils"
import { revalidatePath } from "next/cache"

const BUCKET_NAME = "lovagent-files"

export type S3Response = Omit<_Object, "StorageClass"> & {
  StorageClass?: string
  OriginalKey?: string
}

export async function getFoldersAndFiles(prefix: string) {
  const files = await client.send(
    new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `${prefix}/`,
    })
  )

  let allObjects: S3Response[] = []
  if (files.Contents) {
    allObjects = [
      ...allObjects,
      ...files.Contents.filter(content => {
        if (content.Key?.endsWith("/") && content.Key === `${prefix}/${extractRightOfSlash(content.Key!.slice(0, -1))}/`) return true
        else if (!content.Key?.endsWith("/") && content.Key === `${prefix}/${extractRightOfSlash(content.Key!)}`) return true
        else return false
      }).map(content => {
        if (content.Key?.endsWith("/")) return {
          ...content,
          Key: extractRightOfSlash(content.Key!.slice(0, -1)),
          StorageClass: "DIRECTORY",
          OriginalKey: content.Key
        }
        else return {
          ...content,
          Key: extractRightOfSlash(content.Key!),
          OriginalKey: content.Key
        }
      })
    ];
  }
  return allObjects.sort((a, b) => {
    if (a.StorageClass === 'DIRECTORY' && b.StorageClass !== 'DIRECTORY') {
      return -1;
    } else if (a.StorageClass !== 'DIRECTORY' && b.StorageClass === 'DIRECTORY') {
      return 1;
    } else {
      return 0;
    }
  });
}

export async function deleteObject(key: string, path?: string, revalidate = true) {
  const file = await client.send(new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  }))
  const formData = new FormData()
  formData.set("key", key)
  const response = await fetch(
    `http://localhost:8000/delete_doc/${file.Metadata!["meili-doc-id"]}`,
    {
      method: "POST",
      body: formData
    }
  )
  if (response.ok) {
    const data = await response.json()
    if (data.status === "success") {
      await client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      }))
      if (revalidate && path) revalidatePath("/internal")
    } else {
      console.error(data.message)
    }
  } else {
    console.error("Error:", await response.text())
  }
}

export async function createFolder(folderPath: string, appPath: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${folderPath}/`
  })
  await client.send(command)
  revalidatePath(appPath)
}

export async function deleteFolder(key: string, path?: string, revalidate = true) {
  const files = await client.send(new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: key
  }))
  const subFolders = await client.send(new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: key,
    Delimiter: "/"
  }))
  const objectKeys = [
    ...files.Contents?.map(obj => obj.Key) ?? [],
    ...subFolders.CommonPrefixes?.map(prefix => prefix.Prefix) ?? []
  ];
  await Promise.all(
    objectKeys.map(async (key) => {
      const res = await client.send(new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      }))
      if (res.Metadata?.["meili-doc-id"]) {
        const formData = new FormData()
        formData.set("key", key!)
        const response = await fetch(
          `http://localhost:8000/delete_doc/${res.Metadata["meili-doc-id"]}`,
          {
            method: "POST",
            body: formData
          }
        )
        if (response.ok) {
          const data = await response.json()
          if (data.status === "success") {
            await client.send(new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: key
            }))
          } else {
            console.error(data.message)
          }
        } else {
          console.error("Error:", await response.text())
        }
      } else {
        client.send(new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key
        }))
      }
    })
  )
  if (revalidate && path) revalidatePath(path)
}

export default async function bulkDelete(objects: S3Response[], path: string) {
  await Promise.all(
    objects.map(object => {
      if (object.StorageClass === "DIRECTORY") deleteFolder(object.OriginalKey!, "", false)
      else deleteObject(object.OriginalKey!, "", false)
    })
  )
  revalidatePath(path)
}
