@layer themes {
  /* Light theme */
  .theme-light {
    --background: 0 0% 98%;
    --foreground: 220 14% 10%;
    --primary: 224 82% 56%;
    --secondary: 220 14% 96%;
    --muted: 220 14% 96%;
    --accent: 224 82% 96%;
    --destructive: 0 84.2% 60.2%;
    --success: 142 72% 52%;
    --warning: 38 92% 50%;
    --danger: 0 84% 60%;
    --border: 220 13% 91%;
    --input: 214.3 31.8% 91.4%;
    --ring: 224 82% 56%;
    --radius: .5rem;
    @apply bg-background text-foreground;
  }

  /* Dark theme */
  .theme-dark {
    --background: 220 14% 10%;
    --foreground: 220 14% 96%;
    --primary: 224 82% 56%;
    --secondary: 220 14% 18%;
    --muted: 220 14% 18%;
    --accent: 224 82% 26%;
    --destructive: 0 84.2% 60.2%;
    --success: 142 72% 52%;
    --warning: 
      /* ... other variables remain unchanged ... */
      @apply bg-background text-foreground;
  }
  /* Custom theme for sidebar */
  .theme-sidebar {
    --sidebar-background: 220 14% 10%;
    --sidebar-foreground: 220 14% 96%;
    --sidebar-primary: 224 82% 56%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 14% 18%;
    --sidebar-accent-foreground: 220 14% 96%;
    --sidebar-border: 220 14% 18%;
    --sidebar-ring: 224 82% 56%;
    @apply bg-sidebar-background text-sidebar-foreground;
  }
}

@layer components {
  /* Custom button styles */
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90;
  }

  .btn-secondary {
    @apply bg-secondary text-secondary-foreground hover:bg-secondary/90;
  }

  .btn-destructive {
    @apply bg-destructive text-destructive-foreground hover:bg-destructive/90;
  }

  /* Input styles */
  .input {
    @apply w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring transition-colors;
  }
}
@layer utilities {
  /* Custom utility classes */
  .text-shadow {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .bg-gradient {
    background: linear-gradient(to right, var(--primary), var(--secondary));
  }

  .shadow-glass {
    @apply shadow-lg;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }
}
@layer animations {
  @keyframes slide-up {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes pulse-gentle {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}
@layer screens {
  /* Responsive breakpoints */
  @media (min-width: 640px) {
    .sm\:text-lg {
      font-size: 1.125rem; /* 18px */
    }
  }

  @media (min-width: 768px) {
    .md\:text-xl {
      font-size: 1.25rem; /* 20px */
    }
  }

  @media (min-width: 1024px) {
    .lg\:text-2xl {
      font-size: 1.5rem; /* 24px */
    }
  }

  @media (min-width: 1280px) {
    .xl\:text-3xl {
      font-size: 1.875rem; /* 30px */
    }
  }
}
@layer typography {
  /* Custom typography styles */
  .heading {
    @apply text-2xl font-bold tracking-tight;
  }

  .subheading {
    @apply text-xl font-semibold;
  }

  .paragraph {
    @apply text-base leading-relaxed;
  }

  .small-text {
    @apply text-sm text-muted-foreground;
  }
}
@layer forms {
  /* Custom form styles */
  .form-input {
    @apply w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring transition-colors;
  }

  .form-label {
    @apply block text-sm font-medium text-muted-foreground;
  }

  .form-error {
    @apply text-danger text-sm mt-1;
  }
}
@layer dialogs {
  /* Custom dialog styles */
  .dialog {
    @apply fixed inset-0 z-50 flex items-center justify-center bg-black/50;
  }

  .dialog-content {
    @apply bg-card text-card-foreground p-6 rounded-lg shadow-lg;
  }

  .dialog-header {
    @apply text-xl font-semibold mb-4;
  }

  .dialog-footer {
    @apply flex justify-end space-x-2 mt-4;
  }
}
@layer tooltips {
  /* Custom tooltip styles */
  .tooltip {
    @apply absolute z-50 bg-muted text-muted-foreground px-2 py-1 rounded-md shadow-lg;
    transition: opacity 0.2s ease-in-out;
  }

  .tooltip-arrow {
    @apply absolute w-2 h-2 bg-muted rotate-45;
  }
}
@layer transitions {
  /* Custom transition styles */
  .transition-fast {
    transition: all 0.1s ease-in-out;
  }

  .transition-medium {
    transition: all 0.3s ease-in-out;
  }

  .transition-slow {
    transition: all 0.5s ease-in-out;
  }
}
@layer shadows {
  /* Custom shadow styles */
  .shadow-sm {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px;
  }

  .shadow-md {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }

  .shadow-lg {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  }
}
@layer grids {
  /* Custom grid styles */
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .gap-4 {
    gap: 1rem;
  }
}