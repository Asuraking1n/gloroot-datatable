"use client";

import React, { useState } from "react";
import { DataTable } from "../src/components/DataTable/DataTable";
import { PostModal } from "../src/components/DataTable/PostModal";
import { Post } from "../src/types/data";
import { createPost, updatePost, deletePost } from "../src/services/api";
import { Plus } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleCreateClick = () => {
    setSelectedPost(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: Omit<Post, "id" | "lastUpdated">) => {
    try {
      if (selectedPost) {
        await updatePost(selectedPost.id, data);
      } else {
        await createPost(data);
      }
      setShouldRefetch((prev) => !prev);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        setShouldRefetch((prev) => !prev);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h1 className="text-2xl font-bold text-black">Table UI Preview</h1>
          </div>

          <div className="bg-red-500 inline-block rounded-lg">
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Post</span>
            </button>
          </div>

          <DataTable
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            refetchTrigger={shouldRefetch}
          />
        </div>

        <PostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={selectedPost}
        />
      </div>
    </div>
  );
}
