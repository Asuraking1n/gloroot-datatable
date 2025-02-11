import React, { useEffect } from "react";
import { Post } from "../../../src/types/data";
import { X } from "lucide-react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Post, "id" | "lastUpdated">) => void;
  initialData?: Post;
}

export const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = React.useState({
    title: "",
    author: "",
    body: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        author: initialData?.author || "",
        body: initialData?.body || "",
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      author: "",
      body: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md transform transition-all border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100">
            {initialData ? "Edit Post" : "Create New Post"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-gray-100 placeholder-gray-500"
              required
              placeholder="Enter post title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-gray-100 placeholder-gray-500"
              required
              placeholder="Enter author name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, body: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-gray-100 placeholder-gray-500 resize-none"
              required
              placeholder="Enter post content"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-700 text-white rounded text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
