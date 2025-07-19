'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Star, Download, Upload, Trash2 } from 'lucide-react'
import { TeamBuilder } from '@/components/teams/team-builder'
import { SavedTeams } from '@/components/teams/saved-teams'
import { TeamStats } from '@/components/teams/team-stats'
import { SiteHeader } from '@/components/layout/site-header'

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState<'builder' | 'saved' | 'stats'>('builder')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Team Management</h1>
        <p className="text-gray-600">
          Build, save, and analyze your Pokémon teams for competitive battles
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b">
          <Button
            variant={activeTab === 'builder' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Team Builder
          </Button>
          <Button
            variant={activeTab === 'saved' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('saved')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Saved Teams
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('stats')}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Team Analysis
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'builder' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Create New Team</h2>
              <p className="text-gray-600">
                Build a team of up to 6 Pokémon. Click the + slots to add Pokémon to your team.
              </p>
            </div>
            <TeamBuilder />
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Teams</h2>
                <p className="text-gray-600">
                  Manage your saved teams, import/export, and load teams for battle.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <SavedTeams />
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Team Analysis</h2>
              <p className="text-gray-600">
                Analyze your team&apos;s strengths, weaknesses, and overall balance.
              </p>
            </div>
            <TeamStats />
          </div>
        )}
      </div>

      {/* Quick Stats Overview */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Saved Teams</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Favorite Pokémon</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Battles Won</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">18</div>
            <div className="text-sm text-gray-600">Types Available</div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
} 