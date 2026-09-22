export function Btc({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path fill="#fff" d="M21.7 14.1c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.6 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.7-1.7-.4-.7 2.7c-.4-.1-.7-.2-1.1-.3l-2.3-.6-.4 1.8 1.2.3c.7.2.8.6.8 1l-.8 3.1-1.1 4.3c-.1.2-.3.5-.6.4l-1.2-.3-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.7 1.7.4.7-2.7c.5.1.9.2 1.3.3l-.7 2.7 1.7.4.7-2.7c2.8.5 5 .3 5.9-2.2.7-2.1 0-3.3-1.5-4.1 1.1-.3 1.9-1 2.1-2.5zm-3.8 5.3c-.5 2.1-4 .9-5.1.7l.9-3.6c1.1.3 4.7.8 4.2 2.9zm.5-5.3c-.5 1.9-3.3.9-4.3.7l.8-3.3c.9.2 3.9.6 3.5 2.6z" />
    </svg>
  )
}

export function Eth({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path fill="#E8EBFF" d="M16 6.2 9.8 16.2 16 12.6z" />
      <path fill="#fff" d="M16 6.2 22.2 16.2 16 12.6z" />
      <path fill="#C9D0FF" d="M16 17.2 9.8 16.2 16 25.8z" />
      <path fill="#fff" d="M16 17.2 22.2 16.2 16 25.8z" />
    </svg>
  )
}

export function Sol({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#0b0b12" />
      <path fill="#9945FF" d="M9.2 20.6c.2-.2.4-.3.7-.3h13.2c.4 0 .7.5.3.9l-2.5 2.5c-.2.2-.4.3-.7.3H7c-.4 0-.7-.5-.3-.9z" />
      <path fill="#14F195" d="M9.2 14.2c.2-.2.4-.3.7-.3h13.2c.4 0 .7.5.3.9l-2.5 2.5c-.2.2-.4.3-.7.3H7c-.4 0-.7-.5-.3-.9z" />
      <path fill="#00FFA3" d="M23.4 11.1c-.2.2-.4.3-.7.3H9.5c-.4 0-.7-.5-.3-.9l2.5-2.5c.2-.2.4-.3.7-.3H25c.4 0 .7.5.3.9z" />
    </svg>
  )
}

export function Nft({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#111827" />
      <path fill="#F472B6" d="M8 11.2 16 7l8 4.2v9.6L16 25l-8-4.2z" />
      <path fill="#fff" d="M12.2 12.4h1.6v7.2h-1.6zm2.2 0h1.7l2.4 4.4V12.4h1.5v7.2h-1.7l-2.4-4.4v4.4h-1.5z" />
    </svg>
  )
}

export function Usdt({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path fill="#fff" d="M17.4 15.3v-1.8h4.2V11H10.4v2.5h4.2v1.8C11 15.5 8.8 16.8 8.8 18.4c0 2 3.2 3.6 7.2 3.6s7.2-1.6 7.2-3.6c0-1.6-2.2-2.9-5.8-3.1zm-1.4 4.7c-3 0-5.4-1-5.4-2.2s2.4-2.2 5.4-2.2 5.4 1 5.4 2.2-2.4 2.2-5.4 2.2z" />
    </svg>
  )
}

export const ASSETS = [
  { name: 'Bitcoin', ticker: 'BTC', pair: 'BTC/USDT', Icon: Btc },
  { name: 'Ethereum', ticker: 'ETH', pair: 'ETH/USDT', Icon: Eth },
  { name: 'Solana', ticker: 'SOL', pair: 'SOL/USDT', Icon: Sol },
  { name: 'NFTs', ticker: 'NFT', pair: 'Collectibles', Icon: Nft },
  { name: 'Tether', ticker: 'USDT', pair: 'Stablecoin', Icon: Usdt },
]
