import { useState } from "react";
import { Download, Smartphone, QrCode, Copy, Check, AlertCircle, Shield, Zap } from "lucide-react";

export default function DownloadApk() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const downloadUrl = "https://download.players2pay.com/terminal-latest.apk";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Download className="w-6 h-6 text-[#D4AF37]" />
          Скачать APK
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Установите мобильное приложение для автоматического подтверждения платежей
        </p>
      </div>

      {/* Информация о приложении */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-2xl p-6 border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">PLAYERS2PAY Terminal</h2>
            <p className="text-gray-400 text-sm">Версия 1.1.2</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Безопасное приложение</h3>
              <p className="text-gray-400 text-sm">Приложение имеет доступ только к уведомлениям и не запрашивает лишних разрешений</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Автоподтверждение</h3>
              <p className="text-gray-400 text-sm">Мгновенное подтверждение платежей без вашего участия</p>
            </div>
          </div>
        </div>

        {/* Ссылка для скачивания */}
        <div className="bg-[#0f0f0f] rounded-xl p-4 mb-4">
          <p className="text-gray-400 text-sm mb-2">Прямая ссылка для скачивания:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={downloadUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white text-sm font-mono"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-gray-800 text-[#D4AF37] hover:bg-gray-700 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={downloadUrl}
            download
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#c4a030] transition-colors"
          >
            <Download className="w-4 h-4" />
            Скачать APK
          </a>
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            QR-код
          </button>
        </div>
      </div>

      {/* Инструкция по установке */}
      <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 p-6">
        <h3 className="text-white font-bold mb-4">📱 Как установить?</h3>
        <ol className="space-y-3 text-gray-400 text-sm">
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <span>Скачайте APK-файл на ваш Android-смартфон</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <span>Разрешите установку из неизвестных источников (Настройки → Безопасность)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <span>Откройте приложение и войдите по вашему токену</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
            <span>Разрешите доступ к уведомлениям — приложение начнёт автоматически подтверждать платежи</span>
          </li>
        </ol>
      </div>

      {/* Предупреждение */}
      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-500 font-medium text-sm">Важно!</p>
          <p className="text-gray-400 text-sm">
            Убедитесь, что на устройстве включены уведомления для приложения вашего банка. 
            Только тогда приложение сможет автоматически подтверждать платежи.
          </p>
        </div>
      </div>

      {/* Модалка QR-кода */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-[#0f0f0f] rounded-2xl p-6 w-full max-w-sm border border-[#D4AF37]/20 text-center" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">QR-код для скачивания</h2>
            <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                [QR-код]
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">Отсканируйте QR-код камерой телефона</p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full py-2 bg-[#D4AF37] text-black rounded-lg font-bold"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
