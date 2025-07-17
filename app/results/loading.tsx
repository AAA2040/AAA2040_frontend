//로딩 화면 구성

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <span className="ml-4 text-lg font-medium">분석 중입니다...</span>
    </div>
  )
}