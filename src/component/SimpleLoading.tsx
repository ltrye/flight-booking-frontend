export function SimpleLoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-400"></div>
    </div>
  );
}

export function SimpleLoading() {
  return (
    <div>
      <div className="animate-spin rounded-full size-10 border-t-4 border-b-4 border-blue-400"></div>
    </div>
  );
}
