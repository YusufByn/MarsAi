// Figma Upload design tokens — shared across all form steps

export const labelClass =
  'block text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-2';

export const inputStyle = {
  borderRadius: '24px',
  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
};

export const inputClass = (hasError) =>
  `w-full h-[66px] px-8 text-base text-white placeholder-white/10 focus:outline-none transition-colors ${
    hasError
      ? 'border border-rose-500'
      : 'border border-white/10 focus:border-white/25'
  }`;

export const inputBg = 'bg-white/[0.03]';

export const textareaStyle = {
  borderRadius: '32px',
  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
};

export const textareaClass = (hasError) =>
  `w-full min-h-[180px] px-8 py-6 text-base text-white placeholder-white/10 focus:outline-none transition-colors resize-none leading-relaxed ${
    hasError
      ? 'border border-rose-500'
      : 'border border-white/10 focus:border-white/25'
  }`;

export const errorClass = 'text-rose-400 text-xs mt-1.5';

export const fieldClass = 'space-y-0';

// Section heading with divider lines
export const SectionHeading = ({ children }) => (
  <div className="flex items-center gap-5 mb-8">
    <div className="flex-1 h-px bg-white/10" />
    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 whitespace-nowrap shrink-0">
      {children}
    </span>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);

// Primary "next" button
export const primaryButtonStyle = {
  borderRadius: '24px',
  boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
};

export const primaryButtonClass = (disabled) =>
  `w-full h-[66px] sm:h-[72px] bg-white text-black font-bold text-sm tracking-[0.4em] uppercase transition-opacity ${
    disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'
  }`;

// Secondary "back" button
export const secondaryButtonStyle = {
  borderRadius: '24px',
};

export const secondaryButtonClass =
  'h-[66px] sm:h-[72px] px-8 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 font-bold text-sm tracking-[0.3em] uppercase transition-colors';

// react-select styles matching Figma
export const selectStyles = (hasError) => ({
  control: (base, state) => ({
    ...base,
    minHeight: '66px',
    borderRadius: '24px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: hasError
      ? '#f43f5e'
      : state.isFocused
        ? 'rgba(255,255,255,0.25)'
        : 'rgba(255,255,255,0.1)',
    boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
    padding: '0 20px',
    '&:hover': {
      borderColor: hasError ? '#f43f5e' : 'rgba(255,255,255,0.2)',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    overflow: 'hidden',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(255,255,255,0.05)' : 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, color: '#ffffff' }),
  input: (base) => ({ ...base, color: '#ffffff' }),
  placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.15)' }),
  dropdownIndicator: (base) => ({ ...base, color: 'rgba(255,255,255,0.2)' }),
  indicatorSeparator: () => ({ display: 'none' }),
});
