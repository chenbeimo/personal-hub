import { useState, useEffect, useRef } from 'react';
import { animateNumber } from '../utils/animations';

// 数字动画 Hook
export function useAnimatedNumber(targetValue, duration = 500) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = targetValue;

    if (start !== end) {
      animateNumber(start, end, duration, (value) => {
        setDisplayValue(value);
      });
      prevValue.current = end;
    }
  }, [targetValue, duration]);

  return displayValue;
}

// 列表交错动画 Hook
export function useStaggerAnimation(itemCount, baseDelay = 50) {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    setVisibleItems([]);
    const timers = [];

    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, i * baseDelay);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [itemCount, baseDelay]);

  return visibleItems;
}

// Intersection Observer Hook（滚动触发动画）
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.once) {
            observer.unobserve(element);
          }
        } else if (!options.once) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [options.once, options.threshold, options.rootMargin]);

  return [ref, isInView];
}

// 本地存储 Hook（用于成就系统）
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
