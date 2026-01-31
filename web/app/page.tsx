import Link from "next/link";
import Navbar from "../components/Navbar";

const FEATURES = [
  {
    icon: "🛑",
    title: "Do Nothing",
    description: "Every block you don't interact with the protocol increases your streak multiplier.",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: "😈",
    title: "Resist Temptation",
    description: "Random events will offer you quick rewards to break your streak. Stay strong.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: "🏆",
    title: "Become Legend",
    description: "Earn NFT badges and climb the leaderboard by being the laziest person on chain.",
    color: "from-yellow-500 to-amber-500"
  }
];

const NAVIGATION_CARDS = [
  {
    href: "/dashboard",
    icon: "📊",
    title: "Dashboard",
    description: "Track your streak and locked STX",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
  },
  {
    href: "/achievements",
    icon: "🎖️",
    title: "Achievements",
    description: "Claim your NFT badges",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
  },
  {
    href: "/temptations",
    icon: "😈",
    title: "Temptations",
    description: "See what is trying to break your streak",
    color: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
  },
  {
    href: "/leaderboard",
    icon: "🏆",
    title: "Leaderboard",
    description: "See who is winning at doing nothing",
    color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6">
            The only way to win is to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              do absolutely nothing.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-zinc-600 dark:text-zinc-400 mb-10">
            Lock your STX. Don't touch it. Earn rewards for your inactivity. 
            Beware of temptations that will test your resolve.
          </p>
          
          <div className="flex justify-center gap-4 mb-16">
            <Link 
              href="/start" 
              className="px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform dark:bg-white dark:text-black shadow-lg hover:shadow-xl"
            >
              Start Procrastinating
            </Link>
            <Link 
              href="/leaderboard" 
              className="px-8 py-4 bg-white text-black border border-zinc-200 rounded-full font-bold text-lg hover:bg-zinc-50 transition-colors dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
            >
              View Leaderboard
            </Link>
          </div>

          {/* Navigation Cards */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8">Navigate</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {NAVIGATION_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`p-6 rounded-2xl ${card.color} hover:scale-105 transition-transform border border-transparent hover:shadow-lg`}
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {FEATURES.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
