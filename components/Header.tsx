import Image from 'next/image';

export default function Header() {
  return (
    <div className="bg-[#036B34] py-4 px-9 flex items-center justify-start shadow-md">
      <div className="flex items-center gap-6">
        <Image 
          src="/logo.png" 
          alt="Company Logo" 
          width={50} 
          height={50}
          className="h-10 w-auto"
        />
      </div>
    </div>
  );
}