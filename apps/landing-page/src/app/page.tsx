import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Mic, ShieldCheck, Sparkles, TrendingUp, Smartphone, MessageSquare } from "lucide-react";
import { Logo } from "../components/Logo";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const GradientOrb = ({ className = "" }: { className?: string }) => (
  <div
    className={`pointer-events-none absolute rounded-full blur-3xl opacity-30 ${className}`}
    style={{
      background:
        "conic-gradient(from 0deg, var(--primary) 0%, color-mix(in oklab, var(--primary), white 25%) 25%, var(--primary) 50%, color-mix(in oklab, var(--primary), white 25%) 75%, var(--primary) 100%)",
      mask: "radial-gradient(closest-side, black 30%, transparent 70%)",
    }}
  />
);

const GlassCard = ({ children }: { children: React.ReactNode }) => (
  <div
    className="relative rounded-2xl border border-zinc-200 bg-zinc-150 p-6 backdrop-blur-xs"
  >
    <div className="pointer-events-none absolute inset-0" />
    {children}
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs">
    {children}
  </Badge>
);

const FeatureItem = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card className="relative overflow-hidden border-zinc-200 bg-zinc-50 shadow-xs">
    <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full opacity-10" style={{ background: "radial-gradient(closest-side, var(--primary) 0%, transparent 70%)" }} />
    <CardHeader>
      <CardTitle className="text-base md:text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-primary">{icon}</div>
    </CardContent>
  </Card>
);

const Testimonial = ({ quote, author }: { quote: string; author: string }) => (
  <GlassCard>
    <p className="text-sm md:text-base leading-relaxed">“{quote}”</p>
    <div className="mt-3 text-xs text-muted-foreground">{author}</div>
  </GlassCard>
);

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <Logo width={28} height={34} />
            <span className="font-semibold tracking-tight">Counsy AI</span>
          </div>
          <div className="hidden sm:flex items-center text-sm text-muted-foreground">Coming soon</div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero premium */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_110%_at_50%_-10%,hsl(var(--primary)/0.15)_0%,transparent_45%)]" />
          <GradientOrb className="-top-20 right-[-10%] h-[1720px] w-[1720px]" />
          <GradientOrb className="top-[40%] left-[-10%] h-[1220px] w-[1220px]" />
          <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-20 md:py-28 px-6">
            <div className="flex flex-col gap-6">
              <Badge>Private and caring</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
                Your voice counselor to help you feel better, without judgment
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-prose">
                Speak as you would with a real person. Counsy listens and gently guides you in real time, always protecting your privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center" />
              <div className="flex items-center gap-6 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary"></span>Real-time voice</div>
                <div className="hidden sm:flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary"></span>Full privacy</div>
              </div>
            </div>
            <div className="relative w-full">
              {/* Clean mock device without photos */}
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-xs text-muted-foreground mb-3">Live voice session</div>
                  <div className="space-y-3">
                    {/* User message with avatar */}
                    <div className="flex items-start gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" alt="User avatar" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 border border-zinc-200 bg-zinc-100">
                        <p className="text-sm">Lately I feel overwhelmed and I can’t sleep well.</p>
                      </div>
                    </div>
                    {/* Bot message with app icon */}
                    <div className="flex items-start gap-2 justify-end">
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 text-primary-foreground bg-primary">
                        <p className="text-sm">Let’s take a short breath together. I’m here with you.</p>
                      </div>
                      <Avatar className="size-7 bg-zinc-100">
                        <AvatarFallback>
                          <Logo width={16} height={18} />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </section>

        <section id="caracteristicas" className="border-t border-zinc-200">
          <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-16 px-6">
            <FeatureItem
              title="Natural real-time voice"
              description="Fluid conversation with natural pauses and interruptions. It feels human."
              icon={<div className="h-10 w-10 rounded-lg bg-secondary ring-1 ring-zinc-200 flex items-center justify-center"><Mic className="h-5 w-5" /></div>}
            />
            <FeatureItem
              title="Personalized emotional guidance"
              description="Support for stress, anxiety, decisions, relationships, and everyday wellbeing."
              icon={<div className="h-10 w-10 rounded-lg bg-secondary ring-1 ring-zinc-200 flex items-center justify-center"><MessageSquare className="h-5 w-5" /></div>}
            />
            <FeatureItem
              title="Progress that motivates"
              description="XP, streaks, and achievements to build healthy habits that last."
              icon={<div className="h-10 w-10 rounded-lg bg-secondary ring-1 ring-zinc-200 flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>}
            />
            <FeatureItem
              title="Full privacy"
              description="Your data is yours: decide what to keep and what to delete."
              icon={<div className="h-10 w-10 rounded-lg bg-secondary ring-1 ring-zinc-200 flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></div>}
            />
            <FeatureItem
              title="Mobile ready"
              description="Modern interface built for a clear and safe experience."
              icon={<div className="h-10 w-10 rounded-lg bg-secondary ring-1 ring-zinc-200 flex items-center justify-center"><Smartphone className="h-5 w-5" /></div>}
            />
            <FeatureItem
              title="Focus on wellbeing"
              description="Gentle routines and reminders that add up day by day."
              icon={<div className="h-10 w-10 rounded-lg bg-secondary ring-1 ring-zinc-200 flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>}
            />
          </div>
        </section>

        <section id="privacidad" className="relative overflow-hidden">
          <GradientOrb className="-top-10 left-[-15%] h-[460px] w-[460px]" />
          <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-16 md:py-20 px-6">
            <div className="flex flex-col gap-4">
              <SectionLabel>Privacy and control</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-semibold">Your data is yours</h2>
              <p className="text-muted-foreground">
                Everything you say is stored securely. Keep it only on your device or sync to the cloud if you choose. There’s even a “panic erase” mode.
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> End-to-end encryption</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Full control over sync</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Quick erase in seconds</li>
              </ul>
            </div>
            <GlassCard>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-4">
                  <div className="text-xs text-muted-foreground">On your device</div>
                  <div className="mt-1 text-sm">Your sessions, encrypted and private</div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-4">
                  <div className="text-xs text-muted-foreground">In the cloud (optional)</div>
                  <div className="mt-1 text-sm">Secure sync under your control</div>
                </div>
                <div className="col-span-2 rounded-xl border border-zinc-200 bg-zinc-100 p-4">
                  <div className="text-xs text-muted-foreground">“Panic erase” mode</div>
                  <div className="mt-1 text-sm">Erase all your content in seconds</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="border-t border-zinc-200">
          <div className="container max-w-7xl mx-auto py-16 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Testimonial quote="It helped me calm down before an important meeting. It feels real and close." author="Andrea, 28" />
              <Testimonial quote="Finally something private that actually keeps me motivated. My habits are getting better." author="Diego, 34" />
              <Testimonial quote="I use it when I don’t want to bother my friends. It listens and guides without judgment." author="Lucía, 22" />
            </div>
          </div>
        </section>

        {/* Demo showcase */}
        <section id="demo" className="border-t border-zinc-200">
          <div className="container max-w-7xl mx-auto py-16 px-6">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Demo</SectionLabel>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold">This is how Counsy feels</h2>
              <p className="mt-2 text-muted-foreground">A preview of the conversation flow and the tone of the experience.</p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard>
                <div className="text-xs text-muted-foreground mb-3">Conversation example</div>
                <div className="space-y-3">
                  {/* User message */}
                  <div className="flex items-start gap-2">
                    <Avatar className="size-7">
                      <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" alt="User avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 border border-zinc-200 bg-zinc-100">
                      <p className="text-sm">I’m having a hard time focusing and I feel restless.</p>
                    </div>
                  </div>
                  {/* Bot message */}
                  <div className="flex items-start gap-2 justify-end">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 ml-auto bg-primary text-primary-foreground">
                      <p className="text-sm">Let’s take 30 seconds to breathe. Tell me when you feel the air coming in and out.</p>
                    </div>
                    <Avatar className="size-7 bg-zinc-100">
                      <AvatarFallback>
                        <Logo width={16} height={18} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {/* User follow-up */}
                  <div className="flex items-start gap-2">
                    <Avatar className="size-7">
                      <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" alt="User avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 border border-zinc-200 bg-zinc-100">
                      <p className="text-sm">Done. I already feel calmer.</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
              <div className="relative mx-auto w-full max-w-md rounded-[28px] border border-zinc-100 bg-zinc-50 p-6">
                <div className="mx-auto h-[8px] w-24 rounded-full bg-muted/60" />
                <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-50 bg-zinc-50">
                  <div className="relative h-64 w-full">
                    <Image
                      src="https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg"
                      alt="Person using a phone with headphones"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/0" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="text-white/95 text-sm font-medium">Real-time active listening</div>
                      <div className="flex items-end gap-1" aria-hidden>
                        <span className="w-1 rounded-sm bg-white/90" style={{ height: 12, animation: "pulse 1.2s ease-in-out infinite" }} />
                        <span className="w-1 rounded-sm bg-white/80" style={{ height: 16, animation: "pulse 1.2s ease-in-out infinite", animationDelay: "0.1s" }} />
                        <span className="w-1 rounded-sm bg-white/70" style={{ height: 10, animation: "pulse 1.2s ease-in-out infinite", animationDelay: "0.2s" }} />
                        <span className="w-1 rounded-sm bg-white/80" style={{ height: 18, animation: "pulse 1.2s ease-in-out infinite", animationDelay: "0.3s" }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -inset-px rounded-[28px] ring-1 ring-inset ring-zinc-200/70" />
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Logo width={18} height={22} />
            <span>&copy; {new Date().getFullYear()} Counsy AI</span>
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default Home;
