import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* 主标题 */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            AI危险动作识别报警系统
          </h1>

          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            煤矿安全监控 · 智能预警 · 实时防护
          </p>

          {/* 系统简介 */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
              基于人工智能和图像识别技术，实时监测井下工人行为，通过综合环境参数
              （井深、气体浓度等）智能判定危险动作，自动报警预警，提高煤矿安全生产效率，
              降低事故风险。
            </p>
          </div>

          {/* 功能特点 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                实时监控
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                24小时不间断监控井下作业环境，实时识别工人行为动作
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                智能预警
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                基于环境参数动态调整危险判定标准，智能预警潜在安全风险
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                安全保障
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                降低人为疏漏，提高安全监管效率，保障煤矿生产安全
              </p>
            </div>
          </div>

          {/* 状态指示 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 dark:text-gray-300">
                系统运行正常
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
