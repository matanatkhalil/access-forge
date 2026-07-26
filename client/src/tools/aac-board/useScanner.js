import { useState, useEffect, useCallback, useRef } from 'react';

// Helper to get column numbers based on CSS
const getColumnCount = () => {
  if (typeof window === 'undefined') return 6;
  if (window.innerWidth >= 1024) return 6; // Desktop breakpoint
  if (window.innerWidth >= 500) return 3; // Tablet breakpoint
  return 2; // Mobile default
};

export const useScanner = ({ totalItems = 12, scanSpeed = 1500, onSelectTile }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [mode, setMode] = useState('ROW'); // 'ROW' | 'TILE'
  const [columns, setColumns] = useState(getColumnCount);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [activeTileIndex, setActiveTileIndex] = useState(null);

  // calculate total rows
  const totalRows = Math.ceil(totalItems / columns);

  // keep column count synced when window resizes
  useEffect(() => {
    const handleResize = () => {
      const newCols = getColumnCount();
      setColumns((prevCols) => {
        if (prevCols !== newCols) {
          // Reset scanning positions if layout shifts during resize
          setActiveRowIndex(0);
          setActiveTileIndex(null);
          setMode('ROW');
        }
        return newCols;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSelectRef = useRef(onSelectTile);
  useEffect(() => {
    onSelectRef.current = onSelectTile;
  }, [onSelectTile]);

  // Handle Switch press (Space or Enter)
  const handleSwitchPress = useCallback(() => {
    if (mode === 'ROW') {
      // Lock into active row and begin the scanning of tiles
      setMode('TILE');
      setActiveTileIndex(0);
    } else if (mode === 'TILE') {
      // calculate index in 0-based array from grid coordinates
      const selectedIndex = activeRowIndex * columns + (activeTileIndex || 0);

      if (selectedIndex < totalItems && onSelectRef.current) {
        onSelectRef.current(selectedIndex);
      }

      // Reset back to ROW scanning
      setMode('ROW');
      setActiveRowIndex(0);
      setActiveTileIndex(null);
    }
  }, [mode, activeRowIndex, activeTileIndex, columns, totalItems]);

  // timer loop
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      if (mode === 'ROW') {
        setActiveRowIndex((prev) => (prev + 1) % totalRows);
      } else if (mode === 'TILE') {
        const itemsInCurrentRow = Math.min(columns, totalItems - activeRowIndex * columns);
        setActiveTileIndex((prev) => (prev + 1) % itemsInCurrentRow);
      }
    }, scanSpeed);
    return () => clearInterval(interval);
  }, [isScanning, mode, totalRows, columns, totalItems, activeRowIndex, scanSpeed]);

  // keyboard listener for Switch (Space or Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        // If user is focused on a toolbar or control button, let native keyboard click happen
        const isFocusedOnControl = e.target.closest('.scanner-toolbar, .sentence-controls');
        if (isFocusedOnControl) {
          return; // Exit early and let native button onClick trigger
        }

        e.preventDefault(); // Stop page scrolling
        if (!isScanning) {
          setIsScanning(true);
        } else {
          handleSwitchPress();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScanning, handleSwitchPress]);

  return {
    isScanning,
    setIsScanning,
    mode,
    columns,
    activeRowIndex,
    activeTileIndex,
  };
};
