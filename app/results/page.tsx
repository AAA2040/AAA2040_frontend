//결과 페이지 라우팅 구성
"use client";


import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, Download, ArrowLeft, Volume2, FileText, Music } from "lucide-react"

export default function ResultsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const youtubeUrl = searchParams.get("url")

  // Mock data - in a real app, this would come from your analysis API
  const mockLyrics = `[1절]
고요한 아침 햇살 속에서
꿈들이 시야에서 사라져가네
모든 속삭임이 이야기를 들려줘
사랑과 상실, 그리고 바랜 영광에 대해

[후렴]
우리는 그림자 속에서 춤을 춰
우리가 아는 모든 것에서 빛을 찾아
모든 걸음이 새로운 시작
모든 숨결이 승리의 기회

[2절]
시간은 강물처럼 계속 흘러가고
우리를 떨게 만드는 기억들
하지만 어둠 속에서 우리는 힘을 찾아
어떤 거리든 갈 수 있는 힘을

[후렴]
우리는 그림자 속에서 춤을 춰
우리가 아는 모든 것에서 빛을 찾아
모든 걸음이 새로운 시작
모든 숨결이 승리의 기회

[브릿지]
세상이 무겁게 느껴질 때
그리고 길이 불분명할 때
우리는 계속 믿을 거야
새벽이 가까이 있다는 것을

[아웃트로]
고요한 저녁 햇살 속에서
모든 것이 괜찮아질 거야`

  const mockAudioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (Number.parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const downloadAudio = () => {
    // In a real app, this would download the processed audio file
    const link = document.createElement("a")
    link.href = mockAudioUrl
    link.download = "vocals-removed.mp3"
    link.click()
  }

  const downloadLyrics = () => {
    const blob = new Blob([mockLyrics], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "extracted-lyrics.txt"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Button>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <span className="font-semibold text-gray-900">분석 완료</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audio Player */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                오디오 플레이어
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio ref={audioRef} src={mockAudioUrl} preload="metadata" />

              {/* Play/Pause Button */}
              <div className="flex justify-center">
                <Button onClick={togglePlayPause} size="lg" className="rounded-full w-16 h-16">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <Separator />

              {/* Download Button */}
              <Button onClick={downloadAudio} className="w-full bg-transparent" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                오디오 다운로드
              </Button>
            </CardContent>
          </Card>

          {/* Lyrics Display */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                추출된 가사
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">{mockLyrics}</pre>
              </div>

              <Button onClick={downloadLyrics} className="w-full bg-transparent" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                가사 다운로드
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Source Info */}
        <Card className="mt-6 shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600">
              <p className="font-medium mb-1">원본 영상</p>
              <p className="break-all">{youtubeUrl || "URL이 제공되지 않았습니다"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
