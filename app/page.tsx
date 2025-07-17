"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Music,
  Youtube,
  Headphones,
  FileText,
  Download,
  Play,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [taskId, setTaskId] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [subtitleUrl, setSubtitleUrl] = useState<string>("");
  const [showCompleteMsg, setShowCompleteMsg] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const POLL_INTERVAL = 3000; // 3초

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleAnalysis = async () => {
    if (!youtubeUrl.trim()) return;

    setError(null);
    setIsLoading(true);
    setTaskId(null);
    setLyrics("");
    setAudioUrl("");
    setSubtitleUrl("");
    setShowCompleteMsg(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!res.ok) {
        throw new Error("분석 요청 실패");
      }

      const data = await res.json();
      console.log("서버 응답 데이터:", data);

      if (data.result !== "success") {
        console.error("처리 실패 데이터:", data);
        throw new Error("처리 실패");
      }

      setTaskId(data.uriId);
    } catch (e) {
      console.error("분석 요청 중 오류 발생:", e);
      setError("분석 요청 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/status/${taskId}`);
        if (!res.ok) throw new Error("상태 확인 실패");

        const statusData = await res.json();
        console.log("상태 확인 응답:", statusData);

        if (statusData.status === "COMPLETED") {
          clearInterval(interval);

          const [lyricsRes, subtitleRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/result/${taskId}/lyrics`),
            fetch(`${API_BASE_URL}/api/download/${taskId}/subtitle`),
          ]);

          const lyricsText = await lyricsRes.text();

          setLyrics(lyricsText);
          setSubtitleUrl(`${API_BASE_URL}/api/download/${taskId}/subtitle`);
          setAudioUrl(statusData.mrPath); // 절대 URL 사용
          setShowCompleteMsg(true);
          setIsLoading(false);
        } else if (statusData.status === "FAILED") {
          clearInterval(interval);
          setError("처리 실패");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("상태 체크 오류:", err);
        clearInterval(interval);
        setError("상태 확인 중 오류");
        setIsLoading(false);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [taskId]);

  const sampleUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
  ];

  const features = [
    {
      icon: <Headphones className="h-8 w-8 text-blue-600" />,
      title: "보컬 제거",
      description:
        "AI 기술로 음악에서 보컬을 깔끔하게 분리하여 MR(반주) 음원을 생성합니다.",
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "가사 추출",
      description:
        "음성 인식 기술을 활용하여 노래에서 가사를 자동으로 추출하고 텍스트로 변환합니다.",
    },
    {
      icon: <Download className="h-8 w-8 text-purple-600" />,
      title: "간편한 다운로드",
      description: "처리된 오디오 파일과 추출된 가사를 각각 다운로드할 수 있습니다.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "유튜브 링크 입력",
      description: "분석하고 싶은 유튜브 음악 영상의 URL을 입력하세요.",
    },
    {
      number: "02",
      title: "AI 분석 시작",
      description: "고급 AI 알고리즘이 음성과 반주를 분리하고 가사를 추출합니다.",
    },
    {
      number: "03",
      title: "결과 확인 및 다운로드",
      description:
        "처리된 오디오를 재생하고 추출된 가사를 확인한 후 다운로드하세요.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Music className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">음악 분석기</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            유튜브 영상에서 보컬과 가사를 AI로 분석하고 추출하는
            <br />
            차세대 음악 처리 서비스
          </p>
        </div>

        {/* 입력 카드 */}
        <div className="max-w-md mx-auto mb-20">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl text-center">지금 바로 시작하기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="youtube-url"
                  className="text-sm font-medium text-gray-700"
                >
                  유튜브 URL
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                onClick={handleAnalysis}
                disabled={
                  !youtubeUrl.trim() ||
                  !isValidYouTubeUrl(youtubeUrl) ||
                  isLoading
                }
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    분석 시작
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {error && (
                <p className="text-red-600 mt-2 text-center">{error}</p>
              )}

              {isLoading && (
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-600">
                    영상을 처리하고 있습니다...
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">
                  샘플 URL로 테스트해보세요:
                </p>
                <div className="space-y-1">
                  {sampleUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setYoutubeUrl(url)}
                      className="text-xs text-blue-600 hover:text-blue-800 block truncate w-full text-left"
                      disabled={isLoading}
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 완료 메시지 */}
        {showCompleteMsg && (
          <div className="max-w-md mx-auto p-4 mb-8 bg-green-100 text-green-800 rounded text-center font-semibold">
            🎉 처리 완료! 결과를 확인하세요.
          </div>
        )}

        {/* 결과 */}
        {taskId && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              결과
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="h-5 w-5" />
                      처리된 오디오
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                      {audioUrl ? (
                        <audio controls src={audioUrl} preload="metadata" className="w-full" />
                      ) : (
                        <p className="text-sm text-gray-400">오디오를 불러오는 중입니다...</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => window.open(audioUrl, "_blank")}
                      disabled={!audioUrl}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      오디오 다운로드
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      추출된 가사
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                      {lyrics || "가사를 불러오는 중입니다..."}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => window.open(subtitleUrl, "_blank")}
                      disabled={!subtitleUrl}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      가사 다운로드
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* 주요 기능 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            주요 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 사용 방법 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            사용 방법
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
