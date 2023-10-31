"use client";
import "instantsearch.css/themes/algolia-min.css";
import React, { useEffect, useState } from "react";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  Configure,
  Pagination,
} from "react-instantsearch";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Heading } from "@/components/heading";
import { FileStack } from "lucide-react";
import { FileUpload } from "@/components/file-upload";

const InternalPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [indexExists, setIndexExists] = useState<boolean>(false);

  const searchClient = instantMeiliSearch(
    "http://localhost:7700",
    "9vmh3g5sKkSSns3xik9WzszgmSKx69Peu_E2nlpYEAw"
  );

  useEffect(() => {
    async function checkIndex() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/check_meilisearch_index_exists",
          { method: "GET" }
        );
        const data = await response.json();
        if (data && data.status === "success") {
          setIndexExists(true);
        }
      } catch (error) {
        console.error("Error checking MeiliSearch index:", error);
      }
    }
    checkIndex();
  }, []);

  const handleFileSelect = async (file: File) => {
    setUploadedFiles([...uploadedFiles, file]);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/convert_document",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setExtractedText(data.text);
        } else {
          console.error(data.message);
          setExtractedText(null);
        }
      } else {
        console.error("Error:", await response.text());
        setExtractedText(null);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setExtractedText(null);
    }
  };
  const handleDeleteIndex = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/delete_meilisearch_index",
        { method: "DELETE" }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setIndexExists(false); // Reset the indexExists state
      } else {
        console.error("Error deleting the index:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <Heading
        title="Interntsøk"
        description="Finn de mest relevante interne dokumentene."
        icon={FileStack}
        iconColor="text-yellow-300"
        bgColor="bg-yellow-300/10"
      />
      <div className="px-4 lg:px-8">
        {indexExists ? (
          <InstantSearch indexName="documents" searchClient={searchClient}>
            <div className="space-y-4 mt-4">
              <Configure hitsPerPage={5} />
              <Configure attributesToSnippet={["content:200"]} />
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-5">
                  <SearchBox
                    placeholder="Skriv søkeord her..."
                    classNames={{
                      root: "pb-2",
                      input: "!py-6",
                    }}
                  />
                  <Hits
                    hitComponent={Hit}
                    classNames={{
                      list: "text-black",
                      item: "!w-full !border-none !p-0 ",
                    }}
                  />
                </div>
                <div className="col-span-1 ">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    uploadedFile={uploadedFiles[uploadedFiles.length - 1]}
                  />
                  <ul>
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center pt-4">
                    {" "}
                    <button
                      className="rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      onClick={handleDeleteIndex}
                    >
                      Delete Index
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4 items-center space-x-4 ">
                <Pagination
                  showLast={false}
                  className="navigation-container fixed bottom-0 p-8 "
                />
              </div>
            </div>
          </InstantSearch>
        ) : (
          <FileUpload
            onFileSelect={handleFileSelect}
            uploadedFile={uploadedFiles[uploadedFiles.length - 1]}
          />
        )}
      </div>
    </div>
  );
};

type HitProps = {
  hit: Hit;
};

function Hit({ hit }: HitProps) {
  return (
    <div className="p-8 w-full flex flex-col gap-y-2 rounded-lg bg-muted">
      <div className="flex items-center justify-between">
        <Highlight
          attribute="title"
          hit={hit}
          classNames={{
            highlighted: "!text-lg font-semibold",
            nonHighlighted: "!text-lg font-semibold",
          }}
        />
      </div>
      <Highlight
        attribute="content"
        hit={hit}
        classNames={{
          highlighted: "!text-xs",
          nonHighlighted: "!text-xs",
        }}
      />
    </div>
  );
}

export default InternalPage;
