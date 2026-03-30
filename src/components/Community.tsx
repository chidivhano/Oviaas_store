import { motion } from 'framer-motion';
import { Instagram, Twitter, MessageSquare, Heart, Share2 } from 'lucide-react';

const posts = [
  { id: 1, user: '@oviaas_official', image: 'https://i.postimg.cc/FFGN7jNK/1774303054803.png', likes: '12.4k', comments: 342 },
  { id: 2, user: '@oviaas_lifestyle', image: 'https://i.postimg.cc/y6nskFs7/1774303067303.png', likes: '8.9k', comments: 156 },
  { id: 3, user: '@oviaas_culture', image: 'https://i.postimg.cc/fW5DJxD4/1774303160624.png', likes: '45.2k', comments: 1205 },
  { id: 4, user: '@oviaas_syndicate', image: 'https://i.postimg.cc/MZtqvyqx/1774303256662.png', likes: '3.1k', comments: 89 },
  { id: 5, user: '@oviaas_movement', image: 'https://i.postimg.cc/kMwqBxqd/1774303267288.png', likes: '21.8k', comments: 567 },
  { id: 6, user: '@oviaas_void', image: 'https://i.postimg.cc/MHsSN8dZ/1774303309766.png', likes: '15.6k', comments: 432 },
];

export default function Community() {
  return (
    <section className="w-full min-h-screen bg-dark-bg py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-anton text-5xl md:text-7xl uppercase tracking-tighter neon-text-purple">
              Culture
            </h2>
            <p className="font-display text-gray-400 tracking-widest uppercase text-sm mt-2">
              The Movement
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-[#b026ff]/50 transition-colors">
              <Instagram className="w-5 h-5 text-white" />
            </button>
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-[#00f0ff]/50 transition-colors">
              <Twitter className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={post.image}
                alt={`User ${post.user}`}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="font-display text-sm font-bold text-white mb-4">{post.user}</span>
                
                <div className="flex items-center justify-between text-white/80">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 hover:text-[#b026ff] transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs font-mono">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-[#00f0ff] transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-xs font-mono">{post.comments}</span>
                    </div>
                  </div>
                  <Share2 className="w-5 h-5 hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h3 className="font-anton text-4xl uppercase tracking-tighter mb-6">Join the Syndicate</h3>
          <p className="font-display text-gray-400 mb-8 max-w-md mx-auto">
            Tag @OviaasLifestyle or use #WearTheFuture to be featured in the global feed.
          </p>
          <button className="px-8 py-4 bg-white text-black rounded-full font-display uppercase tracking-widest text-sm font-bold hover:scale-105 transition-transform">
            Connect Wallet / Profile
          </button>
        </div>
      </div>
    </section>
  );
}
