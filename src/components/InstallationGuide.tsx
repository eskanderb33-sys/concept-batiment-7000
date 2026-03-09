import React, { useState } from 'react';
import { Apple, Smartphone, Share, PlusSquare, MoreVertical, Download, CheckCircle2 } from 'lucide-react';

export const InstallationGuide: React.FC = () => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white">Installer l'Application</h2>
            <p className="text-zinc-400">Accédez à Concept 7000 directement depuis votre écran d'accueil</p>
          </div>
          
          <div className="flex bg-zinc-800 p-1 rounded-2xl">
            <button
              onClick={() => setPlatform('ios')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                platform === 'ios' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Apple className="w-4 h-4" />
              iOS
            </button>
            <button
              onClick={() => setPlatform('android')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                platform === 'android' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Android
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Download className="w-6 h-6 text-amber-500" />
              Instructions de configuration
            </h3>

            <div className="space-y-6">
              {platform === 'ios' ? (
                <>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">1</div>
                    <p className="text-zinc-300">Ouvrez <span className="text-white font-bold">Safari</span> et accédez à l'URL de l'application.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">2</div>
                    <p className="text-zinc-300">Appuyez sur le bouton <span className="inline-flex items-center px-2 py-1 bg-zinc-800 rounded text-blue-400 mx-1"><Share className="w-4 h-4" /> Partager</span> en bas de l'écran.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">3</div>
                    <p className="text-zinc-300">Faites défiler vers le bas et sélectionnez <span className="text-white font-bold">"Sur l'écran d'accueil"</span>.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">4</div>
                    <p className="text-zinc-300">Appuyez sur <span className="text-amber-500 font-bold">Ajouter</span> pour confirmer l'installation.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">1</div>
                    <p className="text-zinc-300">Ouvrez <span className="text-white font-bold">Chrome</span> et accédez à l'URL de l'application.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">2</div>
                    <p className="text-zinc-300">Appuyez sur les <span className="inline-flex items-center px-2 py-1 bg-zinc-800 rounded text-zinc-400 mx-1"><MoreVertical className="w-4 h-4" /> trois points</span> en haut à droite.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">3</div>
                    <p className="text-zinc-300">Sélectionnez <span className="text-white font-bold">"Installer l'application"</span> ou "Ajouter à l'écran d'accueil".</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-amber-500 font-bold shrink-0">4</div>
                    <p className="text-zinc-300">Suivez les instructions à l'écran pour finaliser.</p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-white font-bold">Avantages PWA</span>
              </div>
              <ul className="text-sm text-zinc-400 space-y-2">
                <li>• Chargement ultra-rapide</li>
                <li>• Mode plein écran sans barre d'adresse</li>
                <li>• Accès hors ligne partiel</li>
                <li>• Notifications push (si activées)</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[9/19] bg-zinc-800 rounded-[3rem] border-[8px] border-zinc-700 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-700 rounded-b-2xl z-10" />
              
              <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                  <PlusSquare className="w-10 h-10 text-zinc-950" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Concept 7000</h4>
                  <p className="text-zinc-500 text-sm">Ajouter à l'écran d'accueil</p>
                </div>
                <div className="w-full h-32 bg-zinc-900/50 rounded-2xl border border-zinc-700 flex items-center justify-center">
                  <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Aperçu de l'icône</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
