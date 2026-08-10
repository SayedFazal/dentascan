import React from 'react';
import { motion } from 'motion/react';

import CountUp from './ui/CountUp';

interface PlaqueClassCardProps {
  level: 'Low' | 'Medium' | 'High' | 'No Data';
  confidence?: number;
  lastScanDate?: string;
  label?: 'LABEL_0' | 'LABEL_1' | 'LABEL_2' | 'LABEL_3';
  labelId?: number;
  classNameLabel?: string;
  modelType?: string;
}

const PlaqueClassCard: React.FC<PlaqueClassCardProps> = ({ 
  level, 
  confidence, 
  lastScanDate,
  label,
  labelId,
  classNameLabel,
  modelType
}) => {
  const safeConfidence = confidence ?? 0;

  // Derive detection details cleanly
  const getDetectionDetails = () => {
    // 1. Explicit label matching
    if (label) {
      switch (label) {
        case 'LABEL_0':
          return {
            label: 'LABEL_0',
            classId: 0,
            categoryName: 'Healthy',
            severity: 0,
            levelColor: 'text-emerald-500',
            progressColor: 'bg-emerald-500'
          };
        case 'LABEL_1':
          return {
            label: 'LABEL_1',
            classId: 1,
            categoryName: 'Mild Plaque',
            severity: 25,
            levelColor: 'text-sky-500',
            progressColor: 'bg-sky-500'
          };
        case 'LABEL_2':
          return {
            label: 'LABEL_2',
            classId: 2,
            categoryName: 'Moderate Plaque',
            severity: 60,
            levelColor: 'text-[#F59E0B]',
            progressColor: 'bg-[#F59E0B]'
          };
        case 'LABEL_3':
          return {
            label: 'LABEL_3',
            classId: 3,
            categoryName: 'Severe Plaque',
            severity: 90,
            levelColor: 'text-[#EF4444]',
            progressColor: 'bg-[#EF4444]'
          };
      }
    }

    // 2. Fallback based on classNameLabel or level
    const lowerName = (classNameLabel || '').toLowerCase();
    if (lowerName.includes('healthy') || (level === 'Low' && safeConfidence === 0)) {
      return {
        label: 'LABEL_0',
        classId: 0,
        categoryName: 'Healthy',
        severity: 0,
        levelColor: 'text-emerald-500',
        progressColor: 'bg-emerald-500'
      };
    }
    if (lowerName.includes('mild') || level === 'Low') {
      return {
        label: 'LABEL_1',
        classId: 1,
        categoryName: 'Mild Plaque',
        severity: 25,
        levelColor: 'text-sky-500',
        progressColor: 'bg-sky-500'
      };
    }
    if (lowerName.includes('moderate') || level === 'Medium') {
      return {
        label: 'LABEL_2',
        classId: 2,
        categoryName: 'Moderate Plaque',
        severity: 60,
        levelColor: 'text-[#F59E0B]',
        progressColor: 'bg-[#F59E0B]'
      };
    }
    if (lowerName.includes('severe') || level === 'High') {
      return {
        label: 'LABEL_3',
        classId: 3,
        categoryName: 'Severe Plaque',
        severity: 90,
        levelColor: 'text-[#EF4444]',
        progressColor: 'bg-[#EF4444]'
      };
    }

    return {
      label: 'NO_DATA',
      classId: '-',
      categoryName: 'NO DATA',
      severity: 0,
      levelColor: 'text-slate-400',
      progressColor: 'bg-slate-200'
    };
  };

  const details = getDetectionDetails();
  const displayLabel = details.label;
  const displayClassId = labelId ?? details.classId;
  const displayCategory = classNameLabel ? classNameLabel.replace(/_/g, ' ') : details.categoryName;

  return (
    <div className="sleek-card overflow-hidden space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Output Detection</p>
          <span className="text-[10px] font-extrabold text-[#0EA5A8] uppercase tracking-wide">
            {modelType || 'ViTForImageClassification (224x224)'}
          </span>
        </div>
        <div className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-[#0EA5A8] rounded-full text-[11px] font-black tracking-widest">
          {displayLabel} (Class {displayClassId})
        </div>
      </div>

      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Classification Category</p>
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className={`text-2xl sm:text-3xl font-black ${details.levelColor}`}
          >
            {displayCategory.toUpperCase()}
          </motion.span>
        </div>

        {confidence !== undefined && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-baseline gap-1"
          >
            <CountUp 
               to={confidence * 100}
               suffix="%"
               className="text-lg font-black text-slate-700 pb-0.5"
            />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight pb-0.5">Confidence</span>
          </motion.div>
        )}
      </div>

      <div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
          <span>Plaque Biofilm Severity Index</span>
          <span>{details.severity}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${details.severity}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full ${details.progressColor}`}
          />
        </div>
      </div>

      {lastScanDate && (
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold pt-1 border-t border-slate-50">
          Evaluated: {new Date(lastScanDate).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default PlaqueClassCard;
