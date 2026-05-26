/**
 * Spline 3D Scene Mappings and Configuration
 * 
 * To replace placeholders with your actual exported Spline scenes:
 * 1. Open your scene in Spline (https://spline.design)
 * 2. Click "Export" in the top toolbar
 * 3. Select the "Viewer" tab
 * 4. Under "Public Link", copy the URL (e.g., https://prod.spline.design/.../scene.splinecode)
 * 5. Paste the link into the corresponding key below.
 * 
 * NOTE: The application supports both:
 * - Native <spline-viewer url="..."> embeds (highly optimized, handles canvas internally)
 * - React Spline runtime via @splinetool/react-spline (lazy-loaded as fallback or for state binding)
 */

export const SPLINE_SCENES = {
  // High-impact school hero banner
  hero: "https://prod.spline.design/kZmsigwOq4A108Zo/scene.splinecode", // Floating academic objects
  
  // Dashboard Header embeds
  principalDashboard: "https://prod.spline.design/6Wq1Q7YRyKZo-wK5/scene.splinecode", // Floating 3D school tower / globe
  teacherDashboard: "https://prod.spline.design/2n3Q3dCg2r5V-mU7/scene.splinecode",   // Desktop/Book/Stationery items
  studentDashboard: "https://prod.spline.design/kZmsigwOq4A108Zo/scene.splinecode",   // Animated educational icons
  adminDashboard: "https://prod.spline.design/6Wq1Q7YRyKZo-wK5/scene.splinecode",     // Campus layout model
  
  // Empty states
  emptyBooks: "https://prod.spline.design/2n3Q3dCg2r5V-mU7/scene.splinecode",         // Flying notebook
  emptyTransport: "https://prod.spline.design/6Wq1Q7YRyKZo-wK5/scene.splinecode",     // Moving school bus prop
  
  // General fallback
  fallbackObject: "https://prod.spline.design/2n3Q3dCg2r5V-mU7/scene.splinecode"
};

export type SplineSceneKey = keyof typeof SPLINE_SCENES;
