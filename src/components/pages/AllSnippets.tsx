import { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import SnippetCard from "../functionalElements/SnippetCard";
import NewSnippet from "../buttons/NewSnippet";
import SnippetCreation from "../popups/SnippetCreation";
import SnippetsSearchbar from "../functionalElements/SnippetsSearchbar";
import SnippetFullView from "../popups/SnippetFullView";
import type snippet from "../../interfaces/snippet";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmDeleting from "../popups/ConfirmDeleting";
import ToastContainer from "../functionalElements/ToastContainer";
import { CheckCircle } from "lucide-react";

export default function AllSnippets() {
  const [creationMode, setCreationMode] = useState<boolean>(false);
  const [deletingSnippet, setDeletingSnippet] = useState<snippet | null>(null);
  const [snippets, setSnippets] = useState<Array<snippet>>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<snippet | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const { toasts, addToast, removeToast } = useToast();

  const searchForSippet = () => {
    console.log("Actively searching for your code snippet...");
  };

  function fetchSnippets() {
    fetch(`${import.meta.env.VITE_API_URL}/snippets?user_id=1`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSnippets(data.snippets);
      });
  }

  useEffect(() => {
    fetchSnippets();
  }, []);

  function deleteSnippet(snippetId) {
    fetch(`${import.meta.env.VITE_API_URL}/snippets/${snippetId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <div className="w-full lg:flex-1 lg:w-auto p-[20px] lg:p-[40px]">
      <h3 className="text-[24px] lg:text-[20px] font-semibold">All snippets</h3>
      <SnippetsSearchbar
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={() => searchForSippet()}
      />
      <div className="w-full flex flex-col gap-y-6 md:flex-row flex-wrap items-center justify-between mt-4">
        {snippets.map((snippet) => (
          <div className="w-full md:w-[32%]" key={snippet.id}>
            <SnippetCard
              title={snippet.title}
              description={snippet.description}
              language={snippet.language}
              code={snippet.code}
              tags={snippet.tags}
              onEdit={() => console.log("edit")}
              onDelete={() => {
                setDeletingSnippet(snippet);
              }}
              onCardClick={() => setSelectedSnippet(snippet)}
            />
          </div>
        ))}
      </div>
      <NewSnippet onAddNewSnippet={() => setCreationMode(true)} />

      {creationMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setCreationMode(false)}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <SnippetCreation
              onClose={() => setCreationMode(false)}
              onCreate={() =>
                addToast({
                  type: "success",
                  text: "Snippet created successfully!",
                  Icon: CheckCircle,
                })
              }
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedSnippet && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSnippet(null)}
          >
            <SnippetFullView
              snippet={selectedSnippet}
              onClose={() => setSelectedSnippet(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <ConfirmDeleting
        isOpen={deletingSnippet != null ? true : false}
        onConfirm={() => {
          if (!deletingSnippet) return;
          deleteSnippet(deletingSnippet.id);
          setDeletingSnippet(null);
        }}
        onCancel={() => {
          setDeletingSnippet(null);
        }}
        snippetTitle={deletingSnippet?.title}
      />
    </div>
  );
}
