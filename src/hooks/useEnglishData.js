import { useState, useEffect, useCallback } from 'react';
import { getToday } from '../utils/dateUtils';

const ENGLISH_SITE_URL = 'https://chenbeimo.github.io/English-exam';
const DAILY_WORDS_URL = `${ENGLISH_SITE_URL}/daily-words.json`;

export function useEnglishData() {
  const [dailyWords, setDailyWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 读取共享 localStorage 数据
  const getSharedData = useCallback(() => {
    const todayCount = parseInt(localStorage.getItem('en_today_count') || '0');
    const streak = parseInt(localStorage.getItem('en_streak') || '0');
    const totalMastered = parseInt(localStorage.getItem('en_total_mastered') || '0');
    const accuracy = parseInt(localStorage.getItem('en_accuracy') || '0');

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('en_history') || '[]');
    } catch (e) {
      console.error('Error parsing English history:', e);
    }

    // 计算今日数据
    const today = getToday();
    const todayHistory = history.filter((r) => r.date === today);

    return {
      todayCount: todayCount || todayHistory.length,
      streak,
      totalMastered,
      accuracy,
      history,
      todayHistory,
    };
  }, []);

  // 获取每日推荐单词
  const fetchDailyWords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(DAILY_WORDS_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch daily words');
      }

      const data = await response.json();
      setDailyWords(data.words || []);
    } catch (err) {
      console.error('Error fetching daily words:', err);
      setError(err.message);
      // 使用本地备用数据
      setDailyWords(getFallbackWords());
    } finally {
      setLoading(false);
    }
  }, []);

  // 备用单词数据
  const getFallbackWords = () => [
    {
      word: 'ambitious',
      phonetic: '/æmˈbɪʃəs/',
      meaning: '有雄心的，野心勃勃的',
      example: 'She is an ambitious young woman who wants to become a CEO.',
      level: 'CET4',
      category: 'adjective',
    },
    {
      word: 'inevitable',
      phonetic: '/ɪnˈevɪtəbl/',
      meaning: '不可避免的，必然的',
      example: 'Change is inevitable in life.',
      level: 'CET6',
      category: 'adjective',
    },
    {
      word: 'resilient',
      phonetic: '/rɪˈzɪliənt/',
      meaning: '有弹性的，能恢复的',
      example: 'Children are often more resilient than adults.',
      level: 'CET6',
      category: 'adjective',
    },
  ];

  // 加入单词本
  const addToWordbook = useCallback((word) => {
    try {
      const wordbook = JSON.parse(localStorage.getItem('ph_wordbook') || '[]');
      const exists = wordbook.find((w) => w.word === word.word);

      if (!exists) {
        const newWord = {
          ...word,
          addedAt: new Date().toISOString(),
          mastered: false,
          reviewCount: 0,
        };
        wordbook.unshift(newWord);
        localStorage.setItem('ph_wordbook', JSON.stringify(wordbook));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error adding to wordbook:', e);
      return false;
    }
  }, []);

  // 获取单词本
  const getWordbook = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('ph_wordbook') || '[]');
    } catch (e) {
      return [];
    }
  }, []);

  // 打开英语网站
  const openEnglishSite = useCallback((word = null) => {
    const url = word
      ? `${ENGLISH_SITE_URL}/#/word/${word}`
      : ENGLISH_SITE_URL;
    window.open(url, '_blank');
  }, []);

  useEffect(() => {
    fetchDailyWords();
  }, [fetchDailyWords]);

  return {
    dailyWords,
    loading,
    error,
    getSharedData,
    fetchDailyWords,
    addToWordbook,
    getWordbook,
    openEnglishSite,
  };
}
