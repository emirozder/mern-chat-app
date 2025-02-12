const SidebarSkeleton = () => {
  const skeletonContacts = Array(9).fill(null);

  return (
    <div className="overflow-y-auto w-full py-3">
      {skeletonContacts.map((_, idx) => (
        <div key={idx} className="w-full p-3 flex items-center gap-3">
          <div className="relative mx-auto lg:mx-0">
            <div className="skeleton size-12 rounded-full" />
          </div>

          <div className="hidden lg:block text-left min-w-0 flex-1">
            <div className="skeleton h-4 w-32 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;
