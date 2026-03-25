/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-hw-bg font-sans text-hw-card selection:bg-hw-accent/30 overflow-x-hidden relative">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen gap-12">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-hw-card text-hw-accent rounded-full text-[10px] font-mono uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 bg-hw-accent rounded-full animate-pulse" />
            System Active
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-hw-card uppercase">
            Specialist Console
          </h1>
          <p className="hw-label">
            Module: Music & Snake Fusion // Unit: 0x7F
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl">
          {/* Left Panel: System Diagnostics */}
          <aside className="hidden xl:flex flex-col gap-6 w-72">
            <div className="hw-card p-6 space-y-6">
              <div>
                <h4 className="hw-label mb-3">Diagnostics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="hw-label opacity-60">Neural Link</span>
                    <span className="hw-value text-hw-accent">Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="hw-label opacity-60">Buffer Sync</span>
                    <span className="hw-value">14.2ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="hw-label opacity-60">Core Temp</span>
                    <span className="hw-value">32°C</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-hw-text-secondary/20">
                <h4 className="hw-label mb-3">Interface Map</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-hw-bg/5 border border-hw-text-secondary/20 rounded text-center">
                    <span className="hw-label text-[8px]">Nav</span>
                    <div className="hw-value text-[10px]">Arrows</div>
                  </div>
                  <div className="p-2 bg-hw-bg/5 border border-hw-text-secondary/20 rounded text-center">
                    <span className="hw-label text-[8px]">Halt</span>
                    <div className="hw-value text-[10px]">Space</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hw-card p-6">
              <h4 className="hw-label mb-3">System Log</h4>
              <div className="font-mono text-[9px] text-hw-text-secondary space-y-1 h-32 overflow-hidden">
                <p>{'>'} Booting core...</p>
                <p>{'>'} Loading audio assets...</p>
                <p>{'>'} Initializing snake grid...</p>
                <p className="text-hw-accent">{'>'} System ready.</p>
              </div>
            </div>
          </aside>

          {/* Center Panel: Primary Module (Snake) */}
          <section className="flex-1 flex flex-col items-center gap-8">
            <SnakeGame />
          </section>

          {/* Right Panel: Audio Module */}
          <aside className="w-full lg:w-auto">
            <MusicPlayer />
          </aside>
        </div>

        <footer className="mt-auto pt-12 text-hw-text-secondary/40 text-[9px] uppercase tracking-[0.3em] font-mono flex items-center gap-4">
          <span>Hardware Rev. 3.0</span>
          <span className="w-1 h-1 bg-hw-text-secondary/20 rounded-full" />
          <span>© 2026 Specialist Systems</span>
        </footer>
      </main>
    </div>
  );
}

