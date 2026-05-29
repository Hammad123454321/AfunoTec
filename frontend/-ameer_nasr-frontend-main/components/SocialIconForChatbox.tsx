import { Facebook, Globe, Instagram, Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'
import React from 'react'

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  href: string;
}

const SocialIconForChatbox = () => {
  return (
          <div className="divide-y divide-gray-800">
            <ContactItem 
              icon={<MessageCircle className="w-6 h-6" />}
              label="WhatsApp"
              color="text-green-500"
              href="https://wa.me/88017xxxxxxxx" // ← change to your number
            />

            <ContactItem 
              icon={<Facebook className="w-6 h-6" />}
              label="Facebook Messenger"
              color="text-blue-500"
              href="https://m.me/yourpage" // ← change
            />

            <ContactItem 
              icon={<Instagram className="w-6 h-6" />}
              label="Instagram"
              color="text-pink-500"
              href="https://instagram.com/yourusername" // ← change
            />

            <ContactItem 
              icon={<MessageSquare className="w-6 h-6" />}
              label="Livechat"
              color="text-cyan-500"
              href="#" // or your livechat link
            />

            <ContactItem 
              icon={<Mail className="w-6 h-6" />}
              label="E-Mail"
              color="text-red-400"
              href="mailto:hello@yourdomain.com"
            />

            <ContactItem 
              icon={<Phone className="w-6 h-6" />}
              label="Give us a call"
              color="text-emerald-500"
              href="tel:+8801712345678"
            />
          </div>

  )
}

export default SocialIconForChatbox


function ContactItem({ icon, label, color, href }: ContactItemProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-6 py-5 hover:bg-gray-800/50 transition-colors duration-150"
    >
      <div className={`p-2 rounded-lg bg-gray-800/60 ${color}`}>
        {icon}
      </div>
      <span className="text-white font-medium text-lg flex-1">{label}</span>
      <Globe className="w-5 h-5 text-gray-600" />
    </a>
  );
}