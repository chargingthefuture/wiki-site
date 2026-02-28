"use client"

import { useState } from "react"
import { ProblemCard } from "@/components/problem-card"
import { SolutionConnector } from "@/components/solution-connector"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const problemSolutions: Record<string, string[]> = {
  // Image: problem-1.png
  "Do idiots constantly try to get close to you physically, while aiming their cell phones at you and/or staring at their cell phones while invading your personal space?": [
    "GentlePulse",
    "Chyme",
  ],
  // Image: problem-2.png
  "Do your co-workers that you have always been friendly with, suddenly start acting strange towards you and distancing themselves from you? Or they begin to lie about your work performance, try to get you to quit or begin bumping shoulders with you?": [
    "Workforce Recruiter",
    "Directory",
  ],
  // Image: problem-3.png
  "Do idiots sit parked in their cars outside your home all the time?": [
    "LightHouse",
  ],
  // Image: problem-4.png
  "Do morons constantly get in your way and block you from where you are going out in public?/cut you in line?/hold up the line?": [
    "SocketRelay",
    "Directory",
    "Workforce Recruiter",
  ],
  // Image: problem-5.png
  "Did all your neighbors suddenly move, have their houses quickly sold and construction work done on them, then quickly have 'new neighbors' (who don't seem to live there move in)?": [
    "LightHouse",
  ],
  // Image: problem-6.png
  "Have any new street lamps/antennas been installed around your home/work recently?": [
    "LightHouse",
  ],
  // Image: problem-7.png
  "Do drones hover around you/your home/work/all the time?": [
    "LightHouse",
  ],
  // Image: problem-8.png
  "Do you experience tinnitus/ringing in ears?": [
    "GentlePulse",
    "Directory",
  ],
  // Image: problem-9.png
  "Do police officers follow/harass you for no good reason?": [
    "GentlePulse",
    "Directory",
    "Chyme",
  ],
  // Image: problem-10.png
  "Do your neighbors always seem to come outside when you are there, then go inside when you do?": [
    "LightHouse",
  ],
  // Image: problem-11.png
  "Do different people seem to be coming and going from neighbors houses around you all the time?": [
    "LightHouse",
  ],
  // Image: problem-12.png
  "Do several of your neighbors have strange colored lights coming out their windows at night?": [
    "LightHouse",
  ],
  // Image: problem-13.png
  "Do people you don't know stare at you strangely/treat you bad for no reason?": [
    "SupportMatch",
    "GentlePulse",
  ],
  // Image: problem-14.png
  "Are new people pushing hard for you to be their new friend/roommate/romantic partner?": [
    "SupportMatch",
    "GentlePulse",
    "Chyme",
  ],
  // Image: problem-15.png
  "Do people seem to know things about you that you have never told them before?": [
    "SupportMatch",
    "GentlePulse",
    "Chyme",
  ],
  // Image: problem-16.png
  "Do people you don't know constantly try to talk to you/befriend you while you are out in public?": [
    "SupportMatch",
    "GentlePulse",
    "Chyme",
  ],
  // Image: problem-17.png
  "Do strange things happen around you a lot? People fighting/arguing in the streets/causing scenes that are scripted/staged? With occasional onlookers smirking or re-enacting the scripted scenes?": [
    "LightHouse",
  ],
  // Image: problem-18.png
  "Do you get denied jobs/housing for no good reason?": [
    "Workforce Recruiter",
    "Directory",
    "LightHouse",
  ],
  // Image: problem-19.png
  "Do you live close to a freemason lodge? Or know someone who is a freemason?": [
    "LightHouse",
  ],
  // Image: problem-20.png
  "Does trying to do simple things like fill out an online job application become an ordeal due to endless clicking that brings you nowhere? Or website conveniently won't load when you try to submit applications or important documents?": [
    "Workforce Recruiter",
    "Directory",
  ],
  // Image: problem-21.png
  "Do doctors deny you proper care?/ghost you?/tell you you are fine when you know something is wrong?/not get back to you with test results, then claim to have never received them, or have 'no record' of them.": [
    "Workforce Recruiter",
    "Directory",
  ],
  // Image: problem-22.png
  "Do you hear strange humming/buzzing noises/sound of a machine running around you a lot, but can't pinpoint exactly where it's coming from?": [
    "GentlePulse",
  ],
  // Image: problem-23.png
  "Does your mail get lost/tampered with a lot?": [
    "LostMail",
    "Workforce Recruiter",
    "Directory",
  ],
  // Image: problem-24.png
  "Do you get tired more than you should?": [
    "GentlePulse",
    "LightHouse",
  ],
  // Image: problem-25.png
  "Do people try to bait you into doing drugs? buying a gun? buying self-defense gear? drinking? committing illegal acts?": [
    "SupportMatch",
    "GentlePulse",
    "Chyme",
  ],
  // Image: problem-26.png
  "If you are a woman, do perverted guys you don't know or just met straight up ask you for sex?": [
    "SupportMatch",
    "GentlePulse",
    "Chyme",
  ],
  // Image: problem-27.png
  "If you are sitting in your car minding your own business do idiots come and park right by/next to you and sit there too? Usually buried in their phone? Even if you are parked in an isolated area?": [
    "SupportMatch",
    "GentlePulse",
    "Chyme",
  ],
  // Image: problem-28.png
  "Do idiots constantly shine their bright headlights/flashlights/DEWs on you?": [
    "TrustTransport",
  ],
  // Image: problem-29.png
  "Do you often pull up to an empty store, and then it suddenly becomes busy after you go in? Even at non busy business hours?": [
    "SocketRelay",
    "Workforce Recruiter",
    "Directory",
  ],
  // Image: problem-30.png
  "Do weirdos try to get you to say bad things about other people? Or force a conversation about sex, politics or celebrities as if they are recording you?": [
    "SupportMatch",
    "Chyme",
  ],
  // Image: problem-31.png
  "Have you been falsely accused of shoplifting, then still treated like a criminal after you have proven you did not steal anything?": [
    "SupportMatch",
    "Chyme",
  ],
  // Image: problem-32.png
  "Do you notice strange flashes of light wherever you go? Or at home/work?": [
    "SupportMatch",
    "Chyme",
    "LightHouse",
  ],
  // Image: problem-33.png
  "Does everyone around you seem to be keeping some sort of a secret?": [
    "SupportMatch",
    "Directory",
    "Chyme",
  ],
  // Image: problem-34.png
  "Do weirdos offer you rides/solicit you for prostitution when you are just trying to walk down the street? Even during the day?": [
    "TrustTransport",
    "SupportMatch",
    "Chyme",
  ],
  // Image: problem-35.png
  "Do you get strange phone calls/texts from numbers you don't know a lot?": [
    "SupportMatch",
    "Chyme",
  ],
  // Image: problem-36.png
  "Do your pets seem to sense that something is off/someone you don't know is near?": [
    "SupportMatch",
    "LightHouse",
    "Chyme",
  ],
  // Image: problem-37.png
  "Do people seem like they are only pretending to be your friend/partner?": [
    "SupportMatch",
    "Directory",
  ],
  // Image: problem-38.png
  "Do store/hotel clerks suddenly act strangely when you give your name/id?": [
    "SupportMatch",
  ],
  // Image: problem-39.png
  "If you go to walmart/target do the theft detectors beep once quickly when you walk in?": [
    "SupportMatch",
    "SocketRelay",
  ],
  // Image: problem-40.png
  "Do people like to waste your time, sending you on wild goose chases to accomplish simple tasks/appointments?": [
    "Workforce Recruiter",
    "SocketRelay",
    "Directory",
  ],
  // Image: problem-41.png
  "Anytime you have to call a customer service you are put on hold forever only to be hung up on and start the cycle again and again?": [
    "Workforce Recruiter",
    "Directory",
  ],
  // Image: problem-42.png
  "Do you have an unusually large amount of car problems?": [
    "Directory",
  ],
  // Image: problem-43.png
  "Do items disappear, then reappear weeks/months later?": [
    "SocketRelay",
    "Lighthouse",
  ],
  // Image: problem-44.png
  "Do people you've never introduced yourself to somehow already know your name?": [
    "SupportMatch",
    "Chyme",
  ],
  // Image: problem-45.png
  "Do you experience unexplained bruising/cuts/pain/injuries?": [
    "GentlePulse",
    "Directory",
  ],
  // Image: problem-46.png
  "Do you notice Jehovah Witnesses following you and/or lurking in your neighborhood that were not there previously?": [
    "LightHouse",
  ],
  // Image: problem-47.png
  "Do motorcycles, fire trucks and police cars with sirens circle around you?": [
    "LightHouse",
    "GentlePulse",
  ],
  // Image: problem-48.png
  "Do idiots mirror your behaivor and how you dress and follow you around in public?": [
    "LightHouse",
    "Directory",
    "Workforce Recruiter",
  ],
  // Image: problem-49.png
  "Do idiot acquaintances/family you have not seen in decades, or family members you never met, try to force their way into your life?": [
    "LightHouse",
    "Directory",
    "Workforce Recruiter",
    "GentlePulse",
  ],
  // Image: problem-50.png
  "Do weirdos issue attack or guard commands to have dogs bark or whimper at your presence?": [
    "LightHouse",
    "GentlePusle",
  ],
}

const problems = Object.keys(problemSolutions)

export default function LookMaIFixedIt() {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)
  const [hoveredSolution, setHoveredSolution] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-[6px] border-foreground bg-secondary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="p-2 border-[3px] border-foreground bg-card hover:bg-accent transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-accent transform rotate-3 -z-10 scale-110" />
              <div className="bg-foreground text-background px-6 py-3 md:px-10 md:py-5 border-[4px] border-foreground relative">
                <h1 className="font-[var(--font-bangers)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide">
                  LOOK MA, I FIXED IT!
                </h1>
              </div>
            </div>
          </div>
          <p className="font-[var(--font-inter)] text-muted-foreground max-w-3xl text-sm sm:text-base md:text-lg">
            Every problem you've experienced has a solution. Click on any problem to see how our platform addresses it.
            Each solution is a real tool in our super app, built specifically for survivors.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <ProblemCard
              key={index}
              problem={problem}
              solutions={problemSolutions[problem]}
              isSelected={selectedProblem === problem}
              onSelect={() => setSelectedProblem(selectedProblem === problem ? null : problem)}
              onSolutionHover={setHoveredSolution}
              hoveredSolution={hoveredSolution}
              imagePlaceholder={`/images/problems/problem-${index + 1}.png`}
            />
          ))}
        </div>

        {selectedProblem && (
          <SolutionConnector
            problem={selectedProblem}
            solutions={problemSolutions[selectedProblem]}
            onClose={() => setSelectedProblem(null)}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
