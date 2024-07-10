import * as React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {}

const Logo: React.FC<LogoProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={135}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M51.53 20.539 44.563 4.385H48.6l6.092 14.308h-2.377L58.5 4.385h3.715l-6.992 16.154h-3.692ZM71.848 20.539v-2.423l-.23-.531v-4.339c0-.769-.24-1.369-.716-1.8-.462-.43-1.177-.646-2.147-.646-.661 0-1.315.108-1.961.323-.63.2-1.17.477-1.615.831L63.886 9.44c.677-.477 1.493-.846 2.446-1.108a10.948 10.948 0 0 1 2.908-.392c1.892 0 3.362.446 4.408 1.338 1.046.893 1.57 2.285 1.57 4.177v7.085h-3.37Zm-3.785.184c-.969 0-1.8-.161-2.492-.484-.692-.339-1.223-.793-1.592-1.362a3.444 3.444 0 0 1-.554-1.915c0-.738.177-1.385.53-1.938.37-.554.947-.985 1.731-1.293.785-.323 1.808-.485 3.07-.485h3.3v2.1h-2.908c-.846 0-1.43.139-1.754.416a1.34 1.34 0 0 0-.462 1.038c0 .462.177.831.531 1.108.37.262.87.392 1.5.392.6 0 1.139-.138 1.616-.415a2.504 2.504 0 0 0 1.038-1.27l.554 1.662c-.262.8-.739 1.408-1.43 1.823-.693.416-1.585.623-2.678.623ZM85.56 20.724c-1.03 0-1.954-.2-2.77-.6a4.275 4.275 0 0 1-1.869-1.824c-.446-.83-.669-1.884-.669-3.161V8.123h3.6v6.485c0 1.03.215 1.792.646 2.285.447.477 1.07.715 1.87.715.553 0 1.046-.115 1.477-.346.43-.246.769-.616 1.015-1.108.246-.508.37-1.138.37-1.892V8.123h3.6V20.54h-3.416v-3.416l.623.993a4.307 4.307 0 0 1-1.846 1.961 5.46 5.46 0 0 1-2.631.646ZM98.01 20.539V3.416h3.6v17.123h-3.6ZM112.776 20.724c-1.462 0-2.6-.37-3.415-1.108-.816-.754-1.223-1.87-1.223-3.346V5.377h3.6v10.847c0 .523.138.93.415 1.223.277.277.654.415 1.131.415.569 0 1.054-.154 1.454-.462l.969 2.539a4.116 4.116 0 0 1-1.339.6 6.727 6.727 0 0 1-1.592.184Zm-6.554-9.554V8.4h8.608v2.77h-8.608ZM117.981 20.539l6.947-9.577v2.723l-6.647-9.3h4.247l4.592 6.485-1.777.023 4.523-6.508h4.062l-6.6 9.139v-2.677l6.992 9.692h-4.315l-4.754-6.854h1.707l-4.684 6.854h-4.293Z"
    />
    <path
      fill="url(#a)"
      d="M0 4.73a4.73 4.73 0 0 1 9.462 0v14.54a4.73 4.73 0 1 1-9.462 0V4.73Z"
    />
    <rect width={9.462} height={24} x={28.616} fill="url(#b)" rx={4.731} />
    <circle cx={19.038} cy={12.116} r={4.731} fill="url(#c)" />
    <defs>
      <linearGradient
        id="a"
        x1={0}
        x2={9.47}
        y1={21.8}
        y2={2.871}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A7F6FA" />
        <stop offset={1} stopColor="#00B5E9" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={37.344}
        x2={28.608}
        y1={2.867}
        y2={21.196}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E667DB" />
        <stop offset={1} stopColor="#FED9FD" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={21.622}
        x2={16.651}
        y1={8.131}
        y2={15.965}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F288EA" />
        <stop offset={0.306} stopColor="#FEE1FD" />
        <stop offset={0.683} stopColor="#C1F0ED" />
        <stop offset={1} stopColor="#51D7FE" />
      </linearGradient>
    </defs>
  </svg>
);

export default Logo;
