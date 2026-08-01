import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">OBS Remote Control</h1>
      <p className="text-xl mb-12 text-center max-w-lg text-gray-300">
        Control your stream from anywhere with our fat-finger friendly mobile dashboard.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Link 
          href="/login" 
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Moderator Login
        </Link>
        <Link 
          href="/bridge" 
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Setup Streamer Bridge
        </Link>
      </div>
    </main>
  );
}
