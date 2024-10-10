'use client'

import React, { useState, useEffect } from 'react'
import { Book, Coffee, Edit3, Plus, Award, Zap, TrendingUp, Save, PenTool, Calendar, GraduationCap, Trash2, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ZenWriter() {
  const [projects, setProjects] = useState([
    { id: 1, title: "The Silent Sakura", wordCount: 15000, goal: 80000 },
    { id: 2, title: "Neon Teahouse", wordCount: 5000, goal: 60000 },
  ])
  const [newProject, setNewProject] = useState("")
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(timerMinutes * 60)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [achievements, setAchievements] = useState([
    { id: 1, name: "First Words", description: "Write your first 100 words", achieved: false, icon: PenTool },
    { id: 2, name: "Consistent Writer", description: "Maintain a 3-day streak", achieved: false, icon: Calendar },
    { id: 3, name: "Novelist in Training", description: "Reach level 5", achieved: false, icon: GraduationCap },
  ])
  const [quickNote, setQuickNote] = useState("")
  const [savedNotes, setSavedNotes] = useState<string[]>([])
  const [isViewingNotes, setIsViewingNotes] = useState(false)

  const addProject = () => {
    if (newProject) {
      setProjects([...projects, { id: Date.now(), title: newProject, wordCount: 0, goal: 50000 }])
      setNewProject("")
    }
  }

  const updateWordCount = (id: number, newCount: number) => {
    setProjects(projects.map(project => {
      if (project.id === id) {
        const oldCount = project.wordCount
        const difference = newCount - oldCount
        addExperience(Math.abs(difference))
        return { ...project, wordCount: newCount }
      }
      return project
    }))
    checkAchievements()
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
    if (!isTimerRunning) {
      setRemainingTime(timerMinutes * 60)
    }
  }

  const addExperience = (amount: number) => {
    const newExperience = experience + amount
    setExperience(newExperience)
    if (newExperience >= level * 1000) {
      setLevel(level + 1)
      setExperience(newExperience - level * 1000)
    }
  }

  const checkAchievements = () => {
    const totalWords = projects.reduce((sum, project) => sum + project.wordCount, 0)
    const newAchievements = achievements.map(achievement => {
      if (!achievement.achieved) {
        if (achievement.id === 1 && totalWords >= 100) {
          return { ...achievement, achieved: true }
        }
        if (achievement.id === 2 && streak >= 3) {
          return { ...achievement, achieved: true }
        }
        if (achievement.id === 3 && level >= 5) {
          return { ...achievement, achieved: true }
        }
      }
      return achievement
    })
    setAchievements(newAchievements)
  }

  useEffect(() => {
    const savedStreak = localStorage.getItem('streak')
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10))
    }

    const lastWriteDate = localStorage.getItem('lastWriteDate')
    if (lastWriteDate) {
      const today = new Date().toDateString()
      if (lastWriteDate !== today) {
        setStreak(0)
      }
    }

    let interval: NodeJS.Timeout
    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(time => time - 1)
      }, 1000)
    } else if (remainingTime === 0) {
      setIsTimerRunning(false)
      setStreak(streak + 1)
      addExperience(100)
      checkAchievements()
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, remainingTime, setStreak, addExperience, checkAchievements, streak])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const saveQuickNote = () => {
    if (quickNote.trim()) {
      setSavedNotes([...savedNotes, quickNote])
      setQuickNote("")
    }
  }

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  const toggleViewNotes = () => {
    setIsViewingNotes(!isViewingNotes)
  }

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-16 h-16 text-blue-800"
            >
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light mb-2 text-blue-900">ZenWriter</h1>
          <p className="text-xl text-blue-700 mb-4">Minimalist Goal Setting for Aspiring Novelists</p>
          <div className="flex justify-center items-center space-x-4">
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              <Zap className="w-4 h-4 mr-1" />
              Level {level}
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              {experience} / {level * 1000} XP
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              <Award className="w-4 h-4 mr-1" />
              {streak} Day Streak
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <h2 className="text-2xl font-light mb-4 flex items-center text-blue-800">
                <Book className="mr-2" />
                Projects
              </h2>
              <ScrollArea className="h-[300px] pr-4">
                {projects.map(project => (
                  <div key={project.id} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-blue-900">{project.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Progress value={(project.wordCount / project.goal) * 100} className="my-2 bg-blue-100" />
                    <div className="flex justify-between items-center text-sm text-blue-600">
                      <Input
                        type="number"
                        value={project.wordCount}
                        onChange={(e) => updateWordCount(project.id, parseInt(e.target.value) || 0)}
                        className="w-24 text-right bg-blue-50 border-blue-200"
                        min="0"
                      />
                      <span>/ {project.goal} words</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <h2 className="text-2xl font-light mb-4 flex items-center text-blue-800">
                <Plus className="mr-2" />
                New Project
              </h2>
              <div className="flex space-x-2">
                <Input 
                  type="text" 
                  value={newProject} 
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="Enter project title"
                  className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400"
                />
                <Button onClick={addProject} className="bg-blue-800 text-white hover:bg-blue-700">
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <h2 className="text-2xl font-light mb-4 flex items-center text-blue-800">
                <Coffee className="mr-2" />
                Writing Timer
              </h2>
              <div className="text-6xl font-light text-center mb-4 text-blue-900">{formatTime(remainingTime)}</div>
              <div className="flex justify-center space-x-4 items-center mb-4">
                <span className="text-sm text-blue-600">Timer: {timerMinutes} min</span>
                <Switch 
                  checked={isTimerRunning} 
                  onCheckedChange={toggleTimer}
                  aria-label="Start or stop timer"
                />
              </div>
              <Slider
                value={[timerMinutes]}
                onValueChange={([value]) => setTimerMinutes(value)}
                min={5}
                max={60}
                step={5}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <h2 className="text-2xl font-light mb-4 flex items-center text-blue-800">
                <Edit3 className="mr-2" />
                Quick Notes
              </h2>
              <textarea 
                className="w-full h-32 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-900 placeholder-blue-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
                placeholder="Capture your ideas here..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
              ></textarea>
              <Button 
                onClick={saveQuickNote} 
                className="bg-blue-800 text-white hover:bg-blue-700 w-full flex items-center justify-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </Button>
              {savedNotes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Saved Notes</h3>
                  <ScrollArea className="h-40 w-full rounded border border-blue-200">
                    {savedNotes.map((note, index) => (
                      <div key={index} className="p-2 border-b border-blue-100 last:border-b-0">
                        {note}
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <h2 className="text-2xl font-light mb-4 flex items-center justify-between text-blue-800">
                <span className="flex items-center">
                  <Eye className="mr-2" />
                  Saved Notes
                </span>
                <Button
                  onClick={toggleViewNotes}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {isViewingNotes ? 'Hide Notes' : 'View Notes'}
                </Button>
              </h2>
              {isViewingNotes && (
                <ScrollArea className="h-[200px] w-full rounded border border-blue-200">
                  {savedNotes.length > 0 ? (
                    savedNotes.map((note, index) => (
                      <div key={index} className="p-3 border-b border-blue-100 last:border-b-0">
                        <p className="text-blue-800">{note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-blue-600">No saved notes yet.</p>
                  )}
                </ScrollArea>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
              <h2 className="text-2xl font-light mb-4 flex items-center text-blue-800">
                <Award className="mr-2" />
                Achievements
              </h2>
              <div className="space-y-2">
                {achievements.map(achievement => (
                  <TooltipProvider key={achievement.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`p-2 rounded-md flex items-center ${
                            achievement.achieved ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <achievement.icon className="w-5 h-5 mr-2" />
                          {achievement.name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{achievement.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-blue-600">
          <p>Find your flow, one word at a time</p>
        </footer>
      </div>
    </div>
  )
}