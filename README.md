# GloRoots DataTable

A feature-rich data table implementation built with Next.js and TypeScript, featuring a JSON Server backend. This project demonstrates a modern approach to building interactive data tables with comprehensive CRUD operations and advanced filtering capabilities.

## Features

### Data Table

- 📊 Server-side sorting and pagination
- 🔍 Real-time debounced search functionality
- 👁️ Column visibility toggle

### CRUD Operations

- ✨ Create new posts with a modal interface
- 📖 Read and display posts with pagination
- 📝 Update existing posts
- 🗑️ Delete posts with confirmation
- ⏰ Automatic timestamp tracking for updates

## Tech Stack

- **Frontend**

  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide React (icons)

- **Backend**
  - JSON Server
  - Concurrently (for running multiple scripts)

## Getting Started

### Prerequisites

- Node.js (>= 18.17.0)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd gloroots-datatable
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

The project includes both the Next.js frontend and JSON Server backend. You can start both simultaneously using:

```bash
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

To run them separately:

```bash
# Start only the frontend
npm run dev:server

# Start only the backend
npm run server
```

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /posts` - Retrieve all posts (supports pagination, sorting, and filtering)
- `POST /posts` - Create a new post
- `PATCH /posts/:id` - Update an existing post
- `DELETE /posts/:id` - Delete a post

Query parameters:

- `_page` - Page number
- `_limit` - Items per page
- `_sort` - Sort field
- `_order` - Sort order (asc/desc)
- `q` - Search query

## Project Structure

## Customization

### Column Visibility

Users can toggle the visibility of columns using the checkboxes above the table. Available columns:

- Title
- Author
- Content
- Last Updated

### Search

The search functionality includes:

- Real-time input updates
- 100ms debounce to prevent excessive API calls
- Global search across all visible columns

### Pagination

- Previous/Next navigation
- Current page information
- Total results counter
- Items per page display

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
