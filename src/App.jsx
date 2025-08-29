import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Timer, TimerIcon } from 'lucide-react';
import { AlarmClock, Plus, Edit2, Trash2, X } from 'lucide-react';


const TimerApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // Pomodoro Timer States
  const [pomodoroTime, setPomodoroTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  
  // Stopwatch States
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  
  // Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Alarma States

  const [alarms, setAlarms] = useState([]);
const [showAddAlarm, setShowAddAlarm] = useState(false);
const [newAlarmTime, setNewAlarmTime] = useState({ hours: 7, minutes: 0 });
const [newAlarmLabel, setNewAlarmLabel] = useState('');
const [editingAlarm, setEditingAlarm] = useState(null);
const [activeAlarm, setActiveAlarm] = useState(null);




  // Pomodoro Timer Effect
  useEffect(() => {
    let interval = null;
    if (pomodoroActive && pomodoroTimeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroTimeLeft(time => time - 1);
      }, 1000);
    } else if (pomodoroTimeLeft === 0) {
      setPomodoroActive(false);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTimeLeft]);

  // Stopwatch Effect
  useEffect(() => {
    let interval = null;
    if (stopwatchActive) {
      interval = setInterval(() => {
        setStopwatchTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchActive]);

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Alarm Check Effect
useEffect(() => {
  const alarmSound = new Audio('/alarm.wav');

  const checkAlarms = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    alarms.forEach(alarm => {
      if (
        alarm.active &&
        alarm.time.hours === currentHour &&
        alarm.time.minutes === currentMinute &&
        currentSecond === 0
      ) {
        setActiveAlarm(alarm);
        console.log('Alarm triggered:', alarm.label);

        // 🔔 Ses çalsın
        alarmSound.play().catch(err =>
          console.log('Otomatik oynatma engellendi:', err)
        );
      }
    });
  };

  const timer = setInterval(checkAlarms, 1000);
  return () => clearInterval(timer);
}, [alarms]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const updatePomodoroTime = (type, value) => {
    const maxValues = { hours: 23, minutes: 59, seconds: 59 };
    const newValue = Math.max(0, Math.min(value, maxValues[type]));
    const newTime = { ...pomodoroTime, [type]: newValue };
    setPomodoroTime(newTime);
    if (!pomodoroActive) {
      setPomodoroTimeLeft(newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds);
    }
  };

  const handleTimeClick = (field) => {
    if (!pomodoroActive) {
      setEditingField(field);
      setTempValue(String(pomodoroTime[field]));
    }
  };

  const handleTimeInputSubmit = (field) => {
    const value = parseInt(tempValue) || 0;
    updatePomodoroTime(field, value);
    setEditingField(null);
    setTempValue('');
  };

  const handleTimeInputKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      handleTimeInputSubmit(field);
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setTempValue('');
    }
  };

  const togglePomodoro = () => {
    setPomodoroActive(!pomodoroActive);
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroTime({ hours: 0, minutes: 0, seconds: 0 });
    setPomodoroTimeLeft(pomodoroTime.hours * 3600 + pomodoroTime.minutes * 60 + pomodoroTime.seconds);
  };

  const toggleStopwatch = () => {
    setStopwatchActive(!stopwatchActive);
  };

  const resetStopwatch = () => {
    setStopwatchActive(false);
    setStopwatchTime(0);
  };

  // Alarm Functions
const addAlarm = () => {
  const newAlarm = {
    id: Date.now(),
    time: { ...newAlarmTime },
    label: newAlarmLabel || `Alarm ${alarms.length + 1}`,
    active: true
  };
  setAlarms([...alarms, newAlarm]);
  setShowAddAlarm(false);
  setNewAlarmTime({ hours: 7, minutes: 0 });
  setNewAlarmLabel('');
};

const deleteAlarm = (id) => {
  setAlarms(alarms.filter(alarm => alarm.id !== id));
};

const toggleAlarm = (id) => {
  setAlarms(alarms.map(alarm => 
    alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
  ));
};

const updateAlarm = (id, newTime, newLabel) => {
  setAlarms(alarms.map(alarm => 
    alarm.id === id ? { ...alarm, time: newTime, label: newLabel } : alarm
  ));
  setEditingAlarm(null);
};

const dismissAlarm = () => {
  setActiveAlarm(null);
  
  alarmSound.pause();
  
};




  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-pompadour-200 flex flex-col items-center justify-center p-8" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-6xl font-light text-misty_rose-100 mb-16 text-center text-pink-400 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Zenep's Timer App</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        {/* Pomodoro Timer Card */}
        <div 
          onClick={() => setCurrentScreen('pomodoro')}
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#ffb3c6' }}
          >
            <Timer className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-light text-misty_rose-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Pomodoro Timer</h2>
          <p className="text-misty_rose-200 font-light" style={{ fontFamily: 'Georgia, serif' }}>Odaklanarak çalışın</p>
        </div>

        {/* Stopwatch Card */}
        <div 
          onClick={() => setCurrentScreen('stopwatch')}
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#ff8fab',fontFamily: '"Jersey 15", sans-serif' }}
          >
            <TimerIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-light text-misty_rose-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Kronometre</h2>
          <p className="text-misty_rose-200 font-light" style={{ fontFamily: 'Georgia, serif' }}>Zamanı ölçün</p>
        </div>

        {/* Clock Card ! */}
        <div 
          onClick={() => setCurrentScreen('clock')}
          className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#fb6f92' }}
          >
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-light text-misty_rose-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Saat</h2>
          <p className="text-misty_rose-200 font-light" style={{ fontFamily: 'Georgia, serif' }}>Anlık zamanı görün</p>
        </div>

        {/* Alarm Card */}
<div 
  onClick={() => setCurrentScreen('alarm')}
  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
>
  <div 
    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
    style={{ backgroundColor: '#ff6b9d' }}
  >
    <AlarmClock className="w-10 h-10 text-white" />
  </div>
  <h2 className="text-2xl font-light text-misty_rose-100 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Alarm</h2>
  <p className="text-misty_rose-200 font-light" style={{ fontFamily: 'Georgia, serif' }}>Alarm kurma</p>
</div>
      </div>
    </div>
  );

  const PomodoroScreen = () => {
    const timeLeft = formatTime(pomodoroTimeLeft);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-pompadour-200 flex flex-col items-center justify-center p-8" style={{  fontFamily: 'Georgia, serif' }}>
        <button 
          onClick={() => setCurrentScreen('home')}
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-misty_rose-100 hover:bg-white/30 transition-colors font-light" style={{ fontFamily: 'Georgia, serif' }}
        >
          ← Ana Sayfa
        </button>
        
        <h1 className="text-4xl font-light text-misty_rose-100 mb-12 tracking-wide" style={{ fontFamily: '"Jersey 15", sans-serif' }}>Pomodoro Timer</h1>
        
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-12 text-center mb-8">
          <div className="flex justify-center items-center gap-8 mb-8">
            {/* Hours */}
            <div className="text-center" style={{fontFamily: '"Jersey 15", sans-serif'}}>
              {editingField === 'hours' ? (
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => handleTimeInputSubmit('hours')}
                  onKeyDown={(e) => handleTimeInputKeyPress(e, 'hours')}
                  className="text-6xl font-light text-misty_rose-100 bg-transparent border-b-2 text-center w-20 outline-none"
                  style={{ 
                    fontFamily: '"Jersey 15", sans-serif',
                    borderColor: '#ffb3c6'
                  }}
                  autoFocus
                  min="0"
                  max="23"
                />
              ) : (
                <div 
                  onClick={() => handleTimeClick('hours')}
                  className="text-6xl font-light text-misty_rose-100 cursor-pointer transition-colors select-none"
                  style={{ 
                    fontFamily: '"Jersey 15", sans-serif',
                    fontSize: '15rem'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffb3c6'}
                  onMouseLeave={(e) => e.target.style.color = '#61001a'}
                >
                  {String(pomodoroActive ? timeLeft.hours : pomodoroTime.hours).padStart(2, '0')}
                </div>
              )}
              <p className="text-sm text-misty_rose-200 mt-2 font-light" style={{ fontFamily: 'Georgia, serif' }}>Saat</p>
            </div>
            
            <span className="text-6xl font-light text-misty_rose-100" style={{ fontFamily: 'Georgia, serif' }}>:</span>
            
            {/* Minutes */}
            <div className="text-center">
              {editingField === 'minutes' ? (
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => handleTimeInputSubmit('minutes')}
                  onKeyDown={(e) => handleTimeInputKeyPress(e, 'minutes')}
                  className="text-6xl font-light text-misty_rose-100 bg-transparent border-b-2 text-center w-20 outline-none"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    borderColor: '#ffb3c6'
                  }}
                  autoFocus
                  min="0"
                  max="59"
                />
              ) : (
                <div 
                  onClick={() => handleTimeClick('minutes')}
                  className="text-6xl font-light text-misty_rose-100 cursor-pointer transition-colors select-none"
                  style={{ 
                    fontFamily: '"Jersey 15", sans-serif',
                    fontSize: '15rem',
                    
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffb3c6'}
                  onMouseLeave={(e) => e.target.style.color = '#61001a'}
                >
                  {String(pomodoroActive ? timeLeft.minutes : pomodoroTime.minutes).padStart(2, '0')}
                </div>
              )}
              <p className="text-sm text-misty_rose-200 mt-2 font-light" style={{ fontFamily: 'Georgia, serif' }}>Dakika</p>
            </div>
            
            <span className="text-6xl font-light text-misty_rose-100" style={{ fontFamily: 'Georgia, serif' }}>:</span>
            
            {/* Seconds */}
            <div className="text-center">
              {editingField === 'seconds' ? (
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={() => handleTimeInputSubmit('seconds')}
                  onKeyDown={(e) => handleTimeInputKeyPress(e, 'seconds')}
                  className="text-6xl font-light text-misty_rose-100 bg-transparent border-b-2 text-center w-20 outline-none"
                  style={{ 
                    fontFamily: '"Jersey 15", sans-serif',
                    borderColor: '#ffb3c6'
                  }}
                  autoFocus
                  min="0"
                  max="59"
                />
              ) : (
                <div 
                  onClick={() => handleTimeClick('seconds')}
                  className="text-6xl font-light text-misty_rose-100 cursor-pointer transition-colors select-none"
                  style={{ 
                    fontFamily: '"Jersey 15", sans-serif',
                    fontSize: '15rem'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffb3c6'}
                  onMouseLeave={(e) => e.target.style.color = '#61001a'}
                >
                  {String(pomodoroActive ? timeLeft.seconds : pomodoroTime.seconds).padStart(2, '0')}
                </div>
              )}
              <p className="text-sm text-misty_rose-200 mt-2 font-light" style={{ fontFamily: 'Georgia, serif' }}>Saniye</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={togglePomodoro}
              className="text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-colors font-light"
              style={{ 
                fontFamily: 'Georgia, serif',
                backgroundColor: '#ffb3c6'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5c85'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffb3c6'}
            >
              {pomodoroActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {pomodoroActive ? 'Duraklat' : 'Başlat'}
            </button>
            
            <button 
              onClick={resetPomodoro}
              className="text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-colors font-light"
              style={{ 
                fontFamily: 'Georgia, serif',
                backgroundColor: '#ff8fab'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3f6f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff8fab'}
            >
              <RotateCcw className="w-5 h-5" />
              Sıfırla
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StopwatchScreen = () => {
    const time = formatTime(stopwatchTime);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-pompadour-200 flex flex-col items-center justify-center p-8" style={{ fontFamily: 'Georgia, serif' }}>
        <button 
          onClick={() => setCurrentScreen('home')}
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-misty_rose-100 hover:bg-white/30 transition-colors font-light" style={{ fontFamily: 'Georgia, serif' }}
        >
          ← Ana Sayfa
        </button>
        
        <h1 className="text-4xl font-light text-misty_rose-100 mb-12 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Kronometre</h1>
        
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-12 text-center mb-8">
          <div className="flex justify-center items-center gap-8 mb-8">
            <span className="text-8xl font-light text-misty_rose-100" style={{ fontFamily: 'Georgia, serif' }}>
              {String(time.hours).padStart(2, '0')}
            </span>
            <span className="text-8xl font-light text-misty_rose-100" style={{ fontFamily: 'Georgia, serif' }}>:</span>
            <span className="text-8xl font-light text-misty_rose-100" style={{ fontFamily: 'Georgia, serif' }}>
              {String(time.minutes).padStart(2, '0')}
            </span>
            <span className="text-8xl font-light text-misty_rose-100" style={{ fontFamily: 'Georgia, serif' }}>:</span>
            <span className="text-8xl font-light text-misty_rose-100" style={{ fontFamily: 'Georgia, serif' }}>
              {String(time.seconds).padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={toggleStopwatch}
              className="text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-colors font-light" 
              style={{ 
                fontFamily: 'Georgia, serif',
                backgroundColor: '#ff8fab',
                '&:hover': { backgroundColor: '#ff3f6f' }
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3f6f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff8fab'}
            >
              {stopwatchActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {stopwatchActive ? 'Duraklat' : 'Başlat'}
            </button>
            
            <button 
              onClick={resetStopwatch}
              className="text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-colors font-light"
              style={{ 
                fontFamily: 'Georgia, serif',
                backgroundColor: '#fb6f92'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9285d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fb6f92'}
            >
              <RotateCcw className="w-5 h-5" />
              Sıfırla
            </button>
          </div>
        </div>
      </div>
    );
  };

  

  const ClockScreen = () => {
    const time = currentTime.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    const date = currentTime.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-pompadour-200 flex flex-col items-center justify-center p-8" style={{ fontFamily: 'Georgia, serif' }}>
        <button 
          onClick={() => setCurrentScreen('home')}
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-misty_rose-100 hover:bg-white/30 transition-colors font-light" style={{ fontFamily: 'Georgia, serif' }}
        >
          ← Ana Sayfa
        </button>
        
        <div className="text-center">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-16 mb-8">
            <div className="text-8xl font-light text-misty_rose-100 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {time}
            </div>
            <div className="text-2xl text-misty_rose-200 font-light capitalize" style={{ fontFamily: '"Jersey 15", sans-serif' }}>
              {date}
            </div>
          </div>
          
          <div className="flex justify-center">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center animate-pulse"
              style={{ backgroundColor: '#fb6f92',fontFamily: '"Jersey 15", sans-serif' }}
            >
              <Clock className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AlarmScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-pompadour-200 p-8" style={{ fontFamily: 'Georgia, serif' }}>
        <button 
          onClick={() => setCurrentScreen('home')}
          className="mb-8 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-misty_rose-100 hover:bg-white/30 transition-colors font-light" style={{ fontFamily: 'Georgia, serif' }}
        >
          ← Ana Sayfa
        </button>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-light text-misty_rose-100 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Alarmlar</h1>
            <button 
              onClick={() => setShowAddAlarm(true)}
              className="text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors font-light"
              style={{ 
                fontFamily: 'Georgia, serif',
                backgroundColor: '#ff6b9d'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3f7a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b9d'}
            >
              <Plus className="w-5 h-5" />
              Yeni Alarm
            </button>
          </div>
  
          <div className="grid gap-4">
            {alarms.length === 0 ? (
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-12 text-center">
                <AlarmClock className="w-16 h-16 text-misty_rose-200 mx-auto mb-4" />
                <p className="text-misty_rose-200 font-light text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                  Henüz alarm kurulmamış
                </p>
              </div>
            ) : (
              alarms.map(alarm => (
                <div key={alarm.id} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${alarm.active ? 'animate-pulse' : ''}`}
                      style={{ backgroundColor: alarm.active ? '#ff6b9d' : '#9ca3af' }}
                    >
                      <AlarmClock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-light text-misty_rose-100" style={{ fontFamily: '"Jersey 15", sans-serif' }}>
                        {String(alarm.time.hours).padStart(2, '0')}:{String(alarm.time.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-misty_rose-200 font-light" style={{ fontFamily: 'Georgia, serif' }}>
                        {alarm.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingAlarm(alarm)}
                      className="p-2 rounded-lg text-misty_rose-100 hover:bg-white/10 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`px-4 py-2 rounded-xl font-light text-white transition-colors ${
                        alarm.active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {alarm.active ? 'Aktif' : 'Pasif'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
  
        {/* Add Alarm Modal */}
        {showAddAlarm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>Yeni Alarm</h2>
                <button
                  onClick={() => setShowAddAlarm(false)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Saat
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={newAlarmTime.hours}
                      onChange={(e) => setNewAlarmTime({...newAlarmTime, hours: parseInt(e.target.value) || 0})}
                      className="w-full p-3 border border-gray-300 rounded-xl text-center text-2xl font-light"
                      style={{ fontFamily: '"Jersey 15", sans-serif' }}
                    />
                    <p className="text-center text-sm text-gray-600 mt-1" style={{ fontFamily: 'Georgia, serif' }}>Saat</p>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={newAlarmTime.minutes}
                      onChange={(e) => setNewAlarmTime({...newAlarmTime, minutes: parseInt(e.target.value) || 0})}
                      className="w-full p-3 border border-gray-300 rounded-xl text-center text-2xl font-light"
                      style={{ fontFamily: '"Jersey 15", sans-serif' }}
                    />
                    <p className="text-center text-sm text-gray-600 mt-1" style={{ fontFamily: 'Georgia, serif' }}>Dakika</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Alarm Adı
                </label>
                <input
                  type="text"
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  placeholder="Örn: Sabah Alarmı"
                  className="w-full p-3 border border-gray-300 rounded-xl font-light"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddAlarm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-light hover:bg-gray-100 transition-colors"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  İptal
                </button>
                <button
                  onClick={addAlarm}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-light transition-colors"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    backgroundColor: '#ff6b9d'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3f7a'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b9d'}
                >
                  Alarm Kur
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Edit Alarm Modal */}
        {editingAlarm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>Alarmı Düzenle</h2>
                <button
                  onClick={() => setEditingAlarm(null)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Saat
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={editingAlarm.time.hours}
                      onChange={(e) => setEditingAlarm({
                        ...editingAlarm, 
                        time: {...editingAlarm.time, hours: parseInt(e.target.value) || 0}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-xl text-center text-2xl font-light"
                      style={{ fontFamily: '"Jersey 15", sans-serif' }}
                    />
                    <p className="text-center text-sm text-gray-600 mt-1" style={{ fontFamily: 'Georgia, serif' }}>Saat</p>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={editingAlarm.time.minutes}
                      onChange={(e) => setEditingAlarm({
                        ...editingAlarm, 
                        time: {...editingAlarm.time, minutes: parseInt(e.target.value) || 0}
                      })}
                      className="w-full p-3 border border-gray-300 rounded-xl text-center text-2xl font-light"
                      style={{ fontFamily: '"Jersey 15", sans-serif' }}
                    />
                    <p className="text-center text-sm text-gray-600 mt-1" style={{ fontFamily: 'Georgia, serif' }}>Dakika</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Alarm Adı
                </label>
                <input
                  type="text"
                  value={editingAlarm.label}
                  onChange={(e) => setEditingAlarm({...editingAlarm, label: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl font-light"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingAlarm(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-light hover:bg-gray-100 transition-colors"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  İptal
                </button>
                <button
                  onClick={() => updateAlarm(editingAlarm.id, editingAlarm.time, editingAlarm.label)}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-light transition-colors"
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    backgroundColor: '#ff6b9d'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3f7a'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b9d'}
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Active Alarm Notification */}
        {activeAlarm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center max-w-md w-full animate-pulse">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#ff6b9d' }}
              >
                <AlarmClock className="w-12 h-12 text-white animate-bounce" />
              </div>
              
              <h2 className="text-3xl font-light text-gray-800 mb-4" style={{ fontFamily: '"Jersey 15", sans-serif' }}>
                ALARM!
              </h2>
              
              <p className="text-2xl font-light text-gray-800 mb-2" style={{ fontFamily: '"Jersey 15", sans-serif' }}>
                {String(activeAlarm.time.hours).padStart(2, '0')}:{String(activeAlarm.time.minutes).padStart(2, '0')}
              </p>
              
              <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                {activeAlarm.label}
              </p>
              
              <button
                onClick={dismissAlarm}
                className="px-8 py-4 rounded-xl text-white font-light text-lg transition-colors"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  backgroundColor: '#ff6b9d'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#ff3f7a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b9d'}
              >
                Alarmı Kapat
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  

  const renderScreen = () => {
    switch (currentScreen) {
      case 'pomodoro':
        return <PomodoroScreen />;
      case 'stopwatch':
        return <StopwatchScreen />;
      case 'clock':
        return <ClockScreen />;
      case 'alarm':
        return <AlarmScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return renderScreen();
};

export default TimerApp;