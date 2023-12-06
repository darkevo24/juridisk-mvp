"use client";
import { refreshPage } from "@/lib/util-actions";
import { useSession } from "next-auth/react";
import { Upload } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const UploadButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const [onChange, setOnChange] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (onChange) {
      router.refresh();
      setOnChange(false);
    }
  }, [onChange]);

  return (
    <>
      <button
        onClick={() => {
          inputRef.current?.click();
        }}
        className="bg-transparent font-medium text-blue-700 hover:bg-neutral-100 rounded-none px-10 py-5 flex items-center"
      >
        {isPending ? (
          <>
            <div className="w-6 h-6 border-[3px] border-gray-200 rounded-full border-t-current animate-spin"></div>
            <span className="ml-2">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" /> Upload
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            setOnChange(true);
            const formData = new FormData();
            for (const file of e.target.files) {
              formData.append("files", file);
            }
            formData.set("email", session?.user?.email ?? "");
            formData.set(
              "file_path",
              pathname.replace("/files", session?.user?.email ?? "")
            );
            startTransition(async () => {
              const ctrl = new AbortController();
              try {
                await fetchEventSource(
                  "http://localhost:8000/api/convert_document",
                  {
                    method: "POST",
                    signal: ctrl.signal,
                    openWhenHidden: true,
                    body: formData,
                    onopen: async (res) => {
                      const contentType = res.headers.get("content-type");
                      if (
                        !!contentType &&
                        contentType.indexOf("application/json") >= 0
                      ) {
                        throw await res.json();
                      }
                      router.refresh();
                    },
                    onerror: (e) => {
                      if (!!e) {
                        console.log(e);
                      }
                      throw e;
                    },
                    onmessage: async (e) => {
                      const data = e.data;
                      if (!data) {
                        return;
                      }
                      setOnChange(true);
                    },
                  }
                );
              } catch (error) {
                console.log(error);
              }
            });
          }
        }}
      />
    </>
  );
};

export default UploadButton;
