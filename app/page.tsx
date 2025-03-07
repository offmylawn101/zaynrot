import FlappyBird from './components/FlappyBird';
import Chat from './components/Chat';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-[#0000FF] flex items-center justify-center">
      <main className="container mx-auto">
        <h1 className="text-6xl font-bold mb-8 text-center text-pink-500 font-['Comic Sans MS']">Nillion Developer Hub</h1>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <div className="w-full lg:w-[400px]">
            <FlappyBird />
          </div>
          <div className="w-full lg:w-[500px]">
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}
