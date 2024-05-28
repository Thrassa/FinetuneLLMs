import { useEffect, useState } from "react";
import System from "../../../../models/system";
import showToast from "../../../../utils/toast";
import Directory from "./Directory";
import Document from "@/models/document";

// OpenAI Cost per token
// ref: https://openai.com/pricing#:~:text=%C2%A0/%201K%20tokens-,Embedding%20models,-Build%20advanced%20search

export default function DocumentSettings({ systemSettings }) {
  const [availableDocs, setAvailableDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  async function fetchDatasets() {
    setLoading(true);
    const localFiles = await System.localFiles();
    const remoteDatasetsResponse = await Document.readRemoteDatasets();
    const remoteDatasets = remoteDatasetsResponse;

    console.log("localFiles", localFiles);
    console.log("remoteDatasets", remoteDatasets);
    // Documents that are not in the workspace
    const availableDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.items && folder.type === "folder") {
          return {
            ...folder,
            items: folder.items.filter(
              (file) =>
                file.type === "file" &&
                !remoteDatasets.includes(`${folder.name}/${file.name}`)
            ),
          };
        } else {
          return folder;
        }
      }),
    };

    // Documents that are already in the workspace
    setAvailableDocs(availableDocs);
    setLoading(false);
  }

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <div className="flex upload-modal -mt-6 z-10 relative">
      <Directory
        files={availableDocs}
        setFiles={setAvailableDocs}
        loading={loading}
        loadingMessage={loadingMessage}
        setLoading={setLoading}
        fetchDatasets={fetchDatasets}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setLoadingMessage={setLoadingMessage}
      />
      {/* <div className="upload-modal-arrow">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
      </div> */}
      {/* <WorkspaceDirectory
        workspace={workspace}
        files={workspaceDocs}
        highlightWorkspace={highlightWorkspace}
        loading={loading}
        loadingMessage={loadingMessage}
        setLoadingMessage={setLoadingMessage}
        setLoading={setLoading}
        fetchKeys={fetchKeys}
        hasChanges={hasChanges}
        saveChanges={updateWorkspace}
        embeddingCosts={embeddingsCost}
        movedItems={movedItems}
      /> */}
    </div>
  );
}
