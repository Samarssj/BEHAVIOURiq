import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  Brain,
  Users,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Clipboard,
  Save,
  Trash2,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function BehaviorAnalyzer() {
  const [scenario, setScenario] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [toast, setToast] = useState(null);
  const [savedInsights, setSavedInsights] = useState([]);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  // Interactive UI states
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [savingPulse, setSavingPulse] = useState(false);

  // Auto-analyze (debounced) when enabled
  useEffect(() => {
    if (!autoAnalyze) return;
    if (!scenario.trim()) return;
    const id = setTimeout(() => analyzeBehavior(scenario), 600);
    return () => clearTimeout(id);
  }, [scenario, autoAnalyze]);

  // Confetti component (small CSS-based celebration)
  const Confetti = () => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#f43f5e'];
    return (
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{ left: `${(i / 12) * 100}%`, backgroundColor: colors[i % colors.length] }}
          />
        ))}
      </div>
    );
  };

  // Load saved insights on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('behavioriq.savedInsights');
      if (raw) setSavedInsights(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load saved insights', e);
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(6);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p; // wait for completion
        return Math.min(92, p + Math.random() * 12);
      });
    }, 200);

    return () => clearInterval(progressRef.current);
  }, [loading]);

  const behaviorPatterns = {
    conformity: {
      keywords: ['agree', 'group', 'fit in', 'peer pressure', 'same as others', 'follow'],
      behaviorType: 'Social Conformity',
      keyPatterns: [
        'Modifying behavior to match group expectations',
        'Suppressing personal opinions to maintain harmony',
        'Seeking acceptance through behavioral alignment'
      ],
      psychologicalPrinciples: ['Social Proof (Cialdini)', 'Normative Social Influence', 'Groupthink'],
      motivations:
        'Driven by the fundamental human need for belonging and acceptance. Fear of rejection or social exclusion often overrides personal conviction.',
      predictions:
        'May lead to suppressed individuality, reduced innovation in group settings, and potential resentment. Long-term conformity can erode self-confidence and authentic expression.',
      suggestions:
        'Create psychologically safe environments where dissent is valued. Encourage anonymous feedback mechanisms. Practice and reward independent thinking before group discussions.'
    },
    phoneAddiction: {
      keywords: ['phone', 'check', 'scroll', 'social media', 'notification', 'screen'],
      behaviorType: 'Digital Compulsion',
      keyPatterns: [
        'Habitual checking behavior triggered by anxiety or boredom',
        'Variable reward seeking (likes, messages, updates)',
        'Displacement activity to avoid present moment discomfort'
      ],
      psychologicalPrinciples: ['Variable Ratio Reinforcement Schedule', 'Fear of Missing Out (FOMO)', 'Dopamine-driven feedback loops'],
      motivations:
        'Smartphones provide intermittent rewards that are highly addictive. Each check offers potential novelty or social validation, creating a dopamine cycle. Also serves as an escape from uncomfortable social situations.',
      predictions:
        'Decreased attention span, reduced quality of face-to-face interactions, increased anxiety when device is unavailable, and diminished ability to tolerate boredom or uncertainty.',
      suggestions:
        'Implement "phone stacking" during conversations. Use app timers and grayscale mode. Practice mindfulness techniques. Schedule specific "check-in" times rather than constant monitoring.'
    },
    surveillance: {
      keywords: ['watching', 'manager', 'boss', 'harder when', 'observed', 'monitoring'],
      behaviorType: 'Hawthorne Effect',
      keyPatterns: [
        'Performance increases under observation',
        'Motivation shifts from intrinsic to extrinsic',
        'Behavior modification based on perceived expectations'
      ],
      psychologicalPrinciples: ['Hawthorne Effect', 'Social Facilitation', 'Self-Presentation Theory'],
      motivations:
        'Awareness of being observed triggers heightened self-awareness and desire to meet perceived standards. Performance becomes about impression management rather than intrinsic task engagement.',
      predictions:
        'Decreased autonomous motivation over time. Performance may drop when surveillance ends. Can create anxiety and reduce workplace satisfaction if sustained.',
      suggestions:
        'Build trust-based rather than surveillance-based management systems. Focus on outcomes over activities. Develop intrinsic motivation through autonomy, mastery, and purpose.'
    },
    scarcity: {
      keywords: ['limited', 'scarce', 'running out', 'last chance', 'exclusive', 'urgent'],
      behaviorType: 'Scarcity-Driven Decision Making',
      keyPatterns: [
        'Accelerated decision-making under perceived scarcity',
        'Increased perceived value of limited resources',
        'Bypassing rational evaluation processes'
      ],
      psychologicalPrinciples: ['Scarcity Heuristic', 'Loss Aversion', 'Reactance Theory'],
      motivations:
        'Scarcity triggers primal survival instincts and loss aversion. The fear of missing out on a limited opportunity overrides careful deliberation. Urgency short-circuits normal decision-making.',
      predictions:
        "May lead to impulsive purchases, buyer's remorse, and decisions misaligned with actual needs. Can create artificial urgency that damages trust when overused.",
      suggestions:
        'Use ethical scarcity only when genuine. For consumers: implement cooling-off periods for urgent decisions. Ask "Would I buy this without the time pressure?" For marketers: balance urgency with transparency.'
    },
    defensive: {
      keywords: ['defensive', 'feedback', 'criticism', 'reject', 'excuse', 'blame'],
      behaviorType: 'Defensive Reactivity',
      keyPatterns: [
        'Automatic self-protection response to perceived threat',
        'Cognitive dissonance reduction through rationalization',
        'External attribution of negative outcomes'
      ],
      psychologicalPrinciples: ['Ego Defense Mechanisms', 'Cognitive Dissonance', 'Attribution Bias'],
      motivations:
        'Feedback threatens self-image and triggers protective mechanisms. The brain perceives criticism as a threat to identity, activating fight-or-flight responses before rational processing occurs.',
      predictions:
        "Missed growth opportunities, strained relationships, reputation as someone who can't receive feedback. Over time, isolation from honest communication and stunted professional development.",
      suggestions:
        'Practice the "2-second pause" before responding to feedback. Separate feedback on actions from threats to identity. Use "feedback journaling" to reflect later when emotions settle. Create feedback rituals that feel psychologically safe.'
    },
    procrastination: {
      keywords: ['delay', 'procrastinate', 'put off', 'later', 'avoid', 'deadline'],
      behaviorType: 'Task Avoidance & Procrastination',
      keyPatterns: [
        'Present bias favoring immediate gratification over future benefits',
        'Anxiety or perfectionism creating avoidance behavior',
        'Temporal discounting of future consequences'
      ],
      psychologicalPrinciples: ['Present Bias', 'Temporal Discounting', 'Anxiety-Driven Avoidance'],
      motivations:
        'Often stems from fear of failure, perfectionism, or task aversiveness rather than laziness. The brain prioritizes immediate emotional relief over future rewards, creating a cycle of short-term stress reduction.',
      predictions:
        'Increased stress as deadlines approach, reduced quality of work, self-criticism and decreased self-efficacy. Can become a self-fulfilling prophecy where procrastination confirms negative self-beliefs.',
      suggestions:
        'Use the "2-minute rule" to overcome initial resistance. Break tasks into smaller, concrete actions. Time-box work sessions. Address underlying anxiety or perfectionism through self-compassion practices.'
    },
    mirroring: {
      keywords: ['copy', 'mirror', 'imitate', 'mimic', 'same body language', 'match'],
      behaviorType: 'Behavioral Mirroring & Rapport',
      keyPatterns: [
        'Unconscious mimicry of gestures and speech patterns',
        'Synchronization building interpersonal connection',
        'Chameleon effect in social interactions'
      ],
      psychologicalPrinciples: ['Chameleon Effect', 'Mirror Neurons', 'Rapport Building'],
      motivations:
        'Automatic neural response that builds empathy and connection. Mirroring signals "I\'m like you" at a subconscious level, reducing social distance and increasing trust and liking.',
      predictions:
        'Enhanced relationship building, increased persuasiveness, and social influence. Authentic mirroring strengthens bonds; deliberate manipulation can backfire if detected.',
      suggestions:
        'Allow natural mirroring in genuine conversations. Be aware of your own mirroring tendencies. In professional settings, use subtle matching to build rapport. Avoid excessive or obvious mimicry.'
    },
    anchoring: {
      keywords: ['first', 'initial', 'starting point', 'reference', 'comparison', 'anchor'],
      behaviorType: 'Cognitive Anchoring Bias',
      keyPatterns: [
        'Heavy reliance on first piece of information received',
        'Insufficient adjustment from initial anchor',
        'Arbitrary numbers influencing subsequent judgments'
      ],
      psychologicalPrinciples: ['Anchoring Bias', 'Insufficient Adjustment', 'Priming Effects'],
      motivations:
        'The brain uses mental shortcuts to process information efficiently. Initial information creates a reference point that disproportionately influences subsequent judgments, even when the anchor is irrelevant.',
      predictions:
        'Systematic bias in negotiations, pricing decisions, and estimates. Can be exploited in sales and marketing. Leads to suboptimal decisions when anchors are misleading.',
      suggestions:
        'Actively seek multiple reference points before making decisions. Question the source and relevance of initial information. In negotiations, consider making the first offer to set the anchor strategically.'
    }
  };

  const analyzeBehavior = (inputText = null) => {
    const text = (inputText ?? scenario ?? '').trim();
    if (!text) return;

    setLoading(true);
    setAnalysis(null);
    setMatchedKeywords([]);
    setToast(null);

    // Fake processing / simulate progress
    setTimeout(() => {
      const lowerScenario = text.toLowerCase();

      // Find best matching pattern
      let bestMatch = null;
      let maxMatches = 0;
      let bestMatchedKeywords = [];

      for (const [key, pattern] of Object.entries(behaviorPatterns)) {
        const matches = pattern.keywords.filter((keyword) => lowerScenario.includes(keyword));
        if (matches.length > maxMatches) {
          maxMatches = matches.length;
          bestMatch = pattern;
          bestMatchedKeywords = matches;
        }
      }

      // Default analysis if no strong match
      if (!bestMatch) {
        bestMatch = {
          behaviorType: 'General Human Behavior',
          keyPatterns: [
            'Complex interaction of cognitive, emotional, and social factors',
            'Influenced by context, past experiences, and current needs',
            'Rational and irrational elements combining in decision-making'
          ],
          psychologicalPrinciples: ['Cognitive-Behavioral Theory', 'Social Learning Theory', 'Motivation Theory'],
          motivations:
            'Human behavior is multi-determined, arising from biological drives, learned patterns, social context, and cognitive processing. Understanding requires examining the interplay of these factors.',
          predictions:
            'Behavior tends to persist when reinforced and diminish when consequences are negative. Context changes can shift patterns. Self-awareness and intentional practice can modify habitual responses.',
          suggestions:
            'Start by identifying triggers and patterns. Consider what needs the behavior serves. Experiment with alternative responses. Seek feedback from trusted others. Professional guidance can help with persistent challenging patterns.'
        };
        bestMatchedKeywords = [];
      }

      setAnalysis(bestMatch);
      setMatchedKeywords(bestMatchedKeywords);

      // Finish progress
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setToast('Analysis complete!');
        // brief celebratory animation
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);
      }, 350);
    }, 900);
  };

  const exampleScenarios = [
    "Someone always agrees with the group even when they disagree privately",
    "A person checks their phone every few minutes despite being in conversation",
    "An employee works harder when their manager is watching",
    "A customer buys more when they see 'limited time offer'"
  ];

  const onKeyDownHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      analyzeBehavior();
    }
  };

  const copyToClipboard = async (text, label = '') => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(label ? `${label} copied to clipboard` : 'Copied to clipboard');
    } catch (e) {
      setToast('Unable to copy');
    }
  };

  const saveInsight = () => {
    if (!analysis) return;
    const item = {
      id: Date.now(),
      title: analysis.behaviorType,
      scenario: scenario,
      analysis,
      savedAt: new Date().toISOString()
    };
    const next = [item, ...savedInsights].slice(0, 20);
    setSavedInsights(next);
    localStorage.setItem('behavioriq.savedInsights', JSON.stringify(next));
    setToast('Insight saved');
    setSavingPulse(true);
    setTimeout(() => setSavingPulse(false), 700);
  };

  const removeInsight = (id) => {
    const next = savedInsights.filter((s) => s.id !== id);
    setSavedInsights(next);
    localStorage.setItem('behavioriq.savedInsights', JSON.stringify(next));
    setToast('Removed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">{
          celebrate && <Confetti />
        }
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">BehaviorIQ</h1>
          </div>
          <p className="text-gray-600 text-lg">AI-Powered Human Behavior Analysis</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'analyze' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Analyze Behavior
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'insights' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            How It Works
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'analyze' ? (
          <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative">
              {/* Progress bar */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-transparent rounded-t">
                <div
                  className={`h-1 rounded-t bg-gradient-to-r from-indigo-500 to-purple-500 transition-all`} 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <label className="block text-gray-700 font-semibold mb-3">Describe a behavior or scenario:</label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                onKeyDown={onKeyDownHandler}
                placeholder="Example: A team member becomes defensive when receiving constructive feedback..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
                aria-label="Behavior scenario input"
              />

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 mr-2">Try these:</span>
                {exampleScenarios.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setScenario(example);
                      analyzeBehavior(example);
                    }}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 transition-transform transform hover:scale-105"
                    title={`Use example: ${example}`}
                  >
                    {example.slice(0, 40)}...
                  </button>
                ))}

                <button
                  onClick={() => {
                    setScenario('');
                    setAnalysis(null);
                    setMatchedKeywords([]);
                    setToast('Input cleared');
                  }}
                  className="ml-auto text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105"
                >
                  Clear
                </button>
              </div>

              {/* Shortcut hint & Auto-analyze toggle */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl/Cmd</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd> to analyze</div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">Auto-analyze</div>
                  <button
                    onClick={() => setAutoAnalyze(!autoAnalyze)}
                    aria-pressed={autoAnalyze}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${autoAnalyze ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    title="Toggle auto analyze"
                  >
                    <span className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform ${autoAnalyze ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => analyzeBehavior()}
                  disabled={loading || !scenario.trim()}
                  className="mt-2 flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? 'Analyzing...' : 'Analyze Behavior'}
                </button>

                <button
                  onClick={() => copyToClipboard(scenario, 'Scenario')}
                  disabled={!scenario.trim()}
                  className="mt-2 flex items-center gap-2 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-transform transform hover:scale-105"
                  title="Copy scenario"
                >
                  <Clipboard className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>

            {/* Results Section */}
            {analysis && (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 relative">
                {/* little celebratory icon */}
                <div className="absolute -top-4 right-6 flex items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div className="border-l-4 border-indigo-600 pl-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-lg text-gray-800">Behavior Type</h3>
                    </div>
                    <p className="text-gray-700">{analysis.behaviorType}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(analysis.behaviorType, 'Behavior type')}
                      className="p-2 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-transform transform hover:scale-105"
                      title="Copy behavior type"
                    >
                      <Clipboard className="w-4 h-4" />
                    </button>

                    <button
                      onClick={saveInsight}
                      className={`p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-transform transform hover:scale-105 ${savingPulse ? 'animate-save-pulse' : ''}`}
                      title="Save insight"
                    >
                      <Save className="w-4 h-4" />
                    </button>

                    {/* Auto-analyze indicator */}
                    {autoAnalyze && (
                      <div className="ml-2 text-sm text-indigo-600 italic">{loading ? 'Auto analyzing...' : 'Auto-ready'}</div>
                    )}
                  </div>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-lg text-gray-800">Key Patterns</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {analysis.keyPatterns.map((pattern, idx) => (
                      <li key={idx}>{pattern}</li>
                    ))}
                  </ul>

                  {/* Matched keywords */}
                  {matchedKeywords.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-2">Matched keywords:</div>
                      <div className="flex flex-wrap gap-2">
                        {matchedKeywords.map((kw, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const appended = scenario ? `${scenario} ${kw}` : kw;
                              setScenario(appended);
                              analyzeBehavior(appended);
                            }}
                            className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 transition-transform transform hover:scale-105 keyword-animate"
                            title={`Add "${kw}" to the scenario and re-run`}
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-l-4 border-pink-600 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-pink-600" />
                    <h3 className="font-bold text-lg text-gray-800">Psychological Principles</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {analysis.psychologicalPrinciples.map((principle, idx) => (
                      <li key={idx}>{principle}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Underlying Motivations</h4>
                    <p className="text-gray-700 text-sm">{analysis.motivations}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Likely Outcomes</h4>
                    <p className="text-gray-700 text-sm">{analysis.predictions}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Actionable Insights</h3>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-white flex-1">{analysis.suggestions}</p>
                    <div className="flex-shrink-0 ml-4 flex gap-2">
                      <button
                        onClick={() => copyToClipboard(analysis.suggestions, 'Insights')}
                        className="p-2 rounded-md bg-white text-indigo-700 hover:bg-white/90 transition-transform transform hover:scale-105"
                        title="Copy insights"
                      >
                        <Clipboard className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Saved Insights</h3>
                <div className="text-sm text-gray-600">{savedInsights.length} saved</div>
              </div>

              {savedInsights.length === 0 ? (
                <div className="text-gray-600">No saved insights yet — save useful analyses to revisit them later.</div>
              ) : (
                <ul className="space-y-3">
                  {savedInsights.map((s) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                          <div className="text-xs text-gray-500">{new Date(s.savedAt).toLocaleString()}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{s.scenario}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(s.analysis, null, 2), 'Saved insight')}
                            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-100"
                          >
                            <Clipboard className="w-3 h-3 inline" /> Copy
                          </button>
                          <button
                            onClick={() => {
                              setScenario(s.scenario);
                              setAnalysis(s.analysis);
                              setToast('Loaded into workspace');
                            }}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => removeInsight(s.id)}
                            className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full hover:bg-red-100 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How BehaviorIQ Works</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Pattern Recognition</h3>
                  <p className="text-gray-600">Our AI identifies behavioral patterns using psychological frameworks and research-backed principles.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Context Analysis</h3>
                  <p className="text-gray-600">We analyze the context and underlying motivations driving the behavior.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Actionable Insights</h3>
                  <p className="text-gray-600">Get practical suggestions based on established psychological principles and behavioral science.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Use Cases</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span><strong>Management:</strong> Understand team dynamics and improve leadership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span><strong>Marketing:</strong> Decode customer behavior and decision-making</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span><strong>Personal Growth:</strong> Gain insights into your own behavioral patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  <span><strong>UX Design:</strong> Create better user experiences based on behavior</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 bottom-6 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <div className="text-sm text-gray-700">{toast}</div>
        </div>
      )}
    </div>
  );
}
