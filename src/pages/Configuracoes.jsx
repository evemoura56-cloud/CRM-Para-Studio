import React, { useState } from 'react';
import Header from '../components/Header';
import { Palette, Zap, Eye } from 'lucide-react';

const Configuracoes = () => {
  const [neonIntensity, setNeonIntensity] = useState(100);
  const [blinkEnabled, setBlinkEnabled] = useState(true);
  const [neonColor, setNeonColor] = useState('#FF0000');

  const applySettings = () => {
    // Aqui você pode adicionar lógica para aplicar as configurações globalmente
    document.documentElement.style.setProperty('--neon-color', neonColor);
    alert('Configurações aplicadas com sucesso!');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header 
        title="⚙️ Configurações" 
        subtitle="Personalize a aparência e comportamento do sistema"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Configurações de Cor */}
          <div className="card-neon">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-neon-red" />
              <h3 className="text-xl font-poppins text-ice-gray">
                Cor do Neon
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-ice-gray font-inter mb-2">
                  Escolha a cor principal do neon
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={neonColor}
                    onChange={(e) => setNeonColor(e.target.value)}
                    className="w-20 h-20 rounded cursor-pointer border-2 border-charcoal-gray"
                  />
                  <div>
                    <p className="text-ice-gray font-inter text-sm mb-1">
                      Cor selecionada: <span className="font-mono">{neonColor}</span>
                    </p>
                    <p className="text-ice-gray font-inter text-xs">
                      Padrão: #FF0000 (Vermelho Neon)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2">
                <button
                  onClick={() => setNeonColor('#FF0000')}
                  className="h-12 rounded"
                  style={{ backgroundColor: '#FF0000' }}
                  title="Vermelho"
                />
                <button
                  onClick={() => setNeonColor('#00FF00')}
                  className="h-12 rounded"
                  style={{ backgroundColor: '#00FF00' }}
                  title="Verde"
                />
                <button
                  onClick={() => setNeonColor('#0000FF')}
                  className="h-12 rounded"
                  style={{ backgroundColor: '#0000FF' }}
                  title="Azul"
                />
                <button
                  onClick={() => setNeonColor('#FF00FF')}
                  className="h-12 rounded"
                  style={{ backgroundColor: '#FF00FF' }}
                  title="Magenta"
                />
                <button
                  onClick={() => setNeonColor('#00FFFF')}
                  className="h-12 rounded"
                  style={{ backgroundColor: '#00FFFF' }}
                  title="Ciano"
                />
                <button
                  onClick={() => setNeonColor('#FFFF00')}
                  className="h-12 rounded"
                  style={{ backgroundColor: '#FFFF00' }}
                  title="Amarelo"
                />
              </div>
            </div>
          </div>

          {/* Intensidade do Brilho */}
          <div className="card-neon">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-neon-red" />
              <h3 className="text-xl font-poppins text-ice-gray">
                Intensidade do Brilho
              </h3>
            </div>

            <div>
              <label className="block text-ice-gray font-inter mb-3">
                Ajuste a intensidade do efeito neon ({neonIntensity}%)
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={neonIntensity}
                onChange={(e) => setNeonIntensity(e.target.value)}
                className="w-full h-2 bg-charcoal-gray rounded-lg appearance-none cursor-pointer accent-neon-red"
              />
              <div className="flex justify-between mt-2">
                <span className="text-ice-gray font-inter text-sm">Suave</span>
                <span className="text-ice-gray font-inter text-sm">Normal</span>
                <span className="text-ice-gray font-inter text-sm">Intenso</span>
              </div>
            </div>

            {/* Preview do efeito */}
            <div className="mt-6 p-4 bg-dark-bg rounded text-center">
              <p 
                className="text-2xl font-poppins"
                style={{
                  color: neonColor,
                  textShadow: `
                    0 0 ${5 * neonIntensity / 100}px ${neonColor},
                    0 0 ${10 * neonIntensity / 100}px ${neonColor},
                    0 0 ${20 * neonIntensity / 100}px ${neonColor},
                    0 0 ${40 * neonIntensity / 100}px ${neonColor}
                  `
                }}
              >
                INKHOUSE CRM
              </p>
            </div>
          </div>

          {/* Efeito de Piscar */}
          <div className="card-neon">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-neon-red" />
              <h3 className="text-xl font-poppins text-ice-gray">
                Efeito de Piscar Neon
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-gray font-inter mb-1">
                  Ativar efeito de piscar realístico
                </p>
                <p className="text-ice-gray font-inter text-sm">
                  Simula o comportamento de placas neon reais
                </p>
              </div>
              <button
                onClick={() => setBlinkEnabled(!blinkEnabled)}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  blinkEnabled ? 'bg-neon-red shadow-neon-red' : 'bg-charcoal-gray'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    blinkEnabled ? 'transform translate-x-8' : ''
                  }`}
                />
              </button>
            </div>

            {blinkEnabled && (
              <div className="mt-4 p-4 bg-dark-bg rounded text-center">
                <p 
                  className="text-2xl font-poppins animate-neon-blink"
                  style={{ color: neonColor }}
                >
                  EFEITO ATIVO
                </p>
              </div>
            )}
          </div>

          {/* Informações do Sistema */}
          <div className="card-neon">
            <h3 className="text-xl font-poppins text-ice-gray mb-4">
              Informações do Sistema
            </h3>
            
            <div className="space-y-3 text-ice-gray font-inter">
              <div className="flex justify-between py-2 border-b border-charcoal-gray">
                <span>Versão:</span>
                <span className="text-neon-red">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-charcoal-gray">
                <span>Nome do Sistema:</span>
                <span className="text-neon-red">INKHOUSE CRM</span>
              </div>
              <div className="flex justify-between py-2 border-b border-charcoal-gray">
                <span>Slogan:</span>
                <span className="text-neon-red italic">Tatuagens contam histórias. O CRM guarda todas elas.</span>
              </div>
              <div className="flex justify-between py-2 border-b border-charcoal-gray">
                <span>Total de Clientes:</span>
                <span className="text-neon-red">20</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Desenvolvido por:</span>
                <span className="text-neon-red font-semibold">Evelyn Moura • Automação & Processos</span>
              </div>
            </div>
          </div>

          {/* Botão de aplicar */}
          <button
            onClick={applySettings}
            className="neon-button w-full text-lg py-4"
          >
            APLICAR CONFIGURAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
