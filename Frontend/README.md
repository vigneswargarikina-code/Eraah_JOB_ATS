# Job Application Tracker + Analytics Dashboard

A modern React application for tracking job applications with a Kanban board and analytics dashboard.

## Features

### 🎯 Kanban Board
- **Drag-and-drop** functionality using react-beautiful-dnd
- **Four stages**: Applied, Interview, Offer, Rejected
- **Candidate cards** showing name, role, experience, and resume link
- **Add new candidates** via modal form
- **Advanced filtering**: Search by name/role, filter by status, filter by experience

### 📊 Analytics Dashboard
- **Real-time charts** using Recharts
- **Pie chart** showing candidates by stage
- **Bar chart** showing candidates by role
- **Key metrics**: Total candidates, active interviews, offers extended, average experience
- **Dynamic updates** based on database changes

### 🎨 Modern UI
- **Clean design** with TailwindCSS
- **Responsive layout** for all screen sizes
- **Smooth animations** and transitions
- **Dark/light mode** support

## Tech Stack

- **React 18** - UI framework
- **JSX** - Component syntax
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls
- **React Beautiful DnD** - Drag and drop
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Pages

- `/kanban` - Job Application Tracker (Kanban Board)
- `/dashboard` - Analytics Dashboard
- `/` - Redirects to Kanban Board

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on port 5000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## API Integration

The application connects to a backend API with the following endpoints:

- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate
- `PATCH /api/candidates/:id/status` - Update candidate status
- `GET /api/candidates/analytics/overview` - Get analytics data

## Usage

### Adding a Candidate
1. Click "Add Candidate" button
2. Fill in the form with candidate details
3. Submit to add to the "Applied" stage

### Moving Candidates
1. Drag and drop candidate cards between columns
2. Status updates automatically in the database
3. Analytics dashboard updates in real-time

### Filtering and Searching
1. Use the search bar to find candidates by name or role
2. Filter by status using the dropdown
3. Filter by minimum experience level

### Viewing Analytics
1. Navigate to the Dashboard page
2. View charts and metrics
3. Data updates automatically when candidates are added/moved

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn/ui components
│   ├── Layout.jsx    # Main layout with navigation
│   └── AddCandidateModal.jsx
├── pages/
│   ├── KanbanPage.jsx    # Kanban board
│   ├── DashboardPage.jsx # Analytics dashboard
│   └── NotFound.jsx      # 404 page
├── services/
│   └── api.js           # API service functions
├── hooks/
│   └── use-toast.js     # Toast notifications
└── App.jsx              # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Dependencies

### Core Dependencies
- `react` - UI framework
- `react-dom` - React DOM rendering
- `axios` - HTTP client for API calls
- `react-beautiful-dnd` - Drag and drop functionality
- `recharts` - Chart library
- `react-router-dom` - Routing

### UI Dependencies
- `tailwindcss` - CSS framework
- `lucide-react` - Icon library
- `@radix-ui/*` - UI primitives
- `class-variance-authority` - Component variants
- `clsx` - Conditional classes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
