import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode, TransitionEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Instagram, Mail, Menu, X } from 'lucide-react';
import heroImage from '../attached_assets/generated_images/hero-wedding.jpg';
import portraitImage from '../attached_assets/generated_images/portrait-bride.jpg';
import danceImage from '../attached_assets/generated_images/first-dance.jpg';
import coastalImage from '../attached_assets/generated_images/coastal-ceremony.jpg';
import ringsImage from '../attached_assets/generated_images/details-rings.jpg';
import aboutPortraitImage from '../attached_assets/photos/about-portrait.jpg';
import amiraBirthdayImage from '../attached_assets/photos/amira-birthday-01.jpg';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Gallery', href: 'https://brighterdaystophoto.pixieset.com/', external: true },
  { label: 'About', href: '#about' },
];

const menuLinks = [
  { label: 'Gallery', href: 'https://brighterdaystophoto.pixieset.com/', external: true },
  { label: 'About', href: '#about' },
];

const sessionTypes = ['Wedding', 'Engagement', 'Portrait', 'Family', 'Event', 'Something else'];

const days = Array.from({ length: 31 }).map((_, i) => String(i + 1));

const selectArrowStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23232426' stroke-width='1.6'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  backgroundSize: '13px',
};
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];

const heroImages = [heroImage, danceImage, coastalImage, portraitImage, ringsImage];
const HERO_REPEAT = 3;
const heroTrackImages = Array.from({ length: HERO_REPEAT }).flatMap(() => heroImages);
const HERO_TRACK_LEN = heroTrackImages.length;

function HeroSlider() {
  const [index, setIndex] = useState(heroImages.length);
  const [animate, setAnimate] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function restartTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), 4000);
  }

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function go(delta: number) {
    setAnimate(true);
    setIndex((i) => i + delta);
    restartTimer();
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (index >= heroImages.length * 2) {
      setAnimate(false);
      setIndex((i) => i - heroImages.length);
    } else if (index < heroImages.length) {
      setAnimate(false);
      setIndex((i) => i + heroImages.length);
    }
  }

  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full w-[1500%] sm:w-[750%] lg:w-[500%]"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${(index * 100) / HERO_TRACK_LEN}%)`,
            transition: animate ? 'transform 1000ms cubic-bezier(.65,0,.35,1)' : 'none',
          }}
        >
          {heroTrackImages.map((src, i) => (
            <div key={i} className="h-full shrink-0 overflow-hidden" style={{ width: `${100 / HERO_TRACK_LEN}%` }}>
              <img src={src} alt="" className="h-full w-full object-cover opacity-[.82]" />
            </div>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => go(-1)} aria-label="Previous photo" data-testid="button-hero-prev" className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#f6f4ef]/30 bg-[#232426]/50 text-[#f6f4ef] backdrop-blur transition hover:bg-[#f6f4ef] hover:text-[#232426] sm:left-6">
        <ArrowLeft size={18} />
      </button>
      <button type="button" onClick={() => go(1)} aria-label="Next photo" data-testid="button-hero-next" className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#f6f4ef]/30 bg-[#232426]/50 text-[#f6f4ef] backdrop-blur transition hover:bg-[#f6f4ef] hover:text-[#232426] sm:right-6">
        <ArrowRight size={18} />
      </button>
    </>
  );
}

function Logo() {
  return (
    <a href="#top" data-testid="link-logo" className="flex shrink-0 items-center">
      <svg width="112" height="54" viewBox="0 0 112 54" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Brighter Days" className="shrink-0">
        <path d="M1.218 5.468C1.624 5.48733 2.15567 5.50667 2.813 5.526C3.47033 5.54533 4.118 5.555 4.756 5.555C5.66467 5.555 6.53467 5.54533 7.366 5.526C8.19733 5.50667 8.787 5.497 9.135 5.497C11.165 5.497 12.6923 5.92233 13.717 6.773C14.7417 7.62367 15.254 8.716 15.254 10.05C15.254 10.7267 15.109 11.3937 14.819 12.051C14.5483 12.689 14.0843 13.2787 13.427 13.82C12.789 14.342 11.9287 14.7673 10.846 15.096V15.154C12.3733 15.3473 13.5623 15.7147 14.413 16.256C15.283 16.778 15.892 17.3967 16.24 18.112C16.588 18.8273 16.762 19.5813 16.762 20.374C16.762 21.476 16.4817 22.4523 15.921 23.303C15.3797 24.1343 14.587 24.7917 13.543 25.275C12.499 25.7583 11.252 26 9.802 26C9.37667 26 8.73867 25.9903 7.888 25.971C7.03733 25.9323 6.01267 25.913 4.814 25.913C4.13733 25.913 3.47033 25.9227 2.813 25.942C2.15567 25.942 1.624 25.9613 1.218 26V25.42C1.87533 25.3813 2.36833 25.304 2.697 25.188C3.045 25.072 3.277 24.84 3.393 24.492C3.509 24.144 3.567 23.622 3.567 22.926V8.542C3.567 7.82666 3.509 7.30467 3.393 6.976C3.277 6.628 3.045 6.396 2.697 6.28C2.36833 6.14467 1.87533 6.06733 1.218 6.048V5.468ZM8.41 6.048C7.52067 6.048 6.94067 6.21233 6.67 6.541C6.39933 6.86967 6.264 7.53667 6.264 8.542V22.926C6.264 23.6027 6.322 24.115 6.438 24.463C6.554 24.811 6.76667 25.043 7.076 25.159C7.38533 25.275 7.83967 25.333 8.439 25.333C10.3337 25.333 11.7063 24.898 12.557 24.028C13.427 23.1387 13.862 21.882 13.862 20.258C13.862 18.7693 13.456 17.619 12.644 16.807C11.8513 15.995 10.5367 15.589 8.7 15.589H5.713C5.713 15.589 5.713 15.5117 5.713 15.357C5.713 15.183 5.713 15.096 5.713 15.096H8.207C9.34767 15.096 10.2273 14.8833 10.846 14.458C11.4647 14.0133 11.89 13.4333 12.122 12.718C12.354 11.9833 12.47 11.2003 12.47 10.369C12.47 8.93833 12.151 7.86533 11.513 7.15C10.8943 6.41533 9.86 6.048 8.41 6.048ZM27.7868 10.659C28.3088 10.659 28.7631 10.7653 29.1498 10.978C29.5558 11.1907 29.8651 11.471 30.0778 11.819C30.3098 12.1477 30.4258 12.5247 30.4258 12.95C30.4258 13.4333 30.2711 13.8587 29.9618 14.226C29.6718 14.5933 29.2754 14.777 28.7728 14.777C28.3668 14.777 28.0091 14.6513 27.6998 14.4C27.3904 14.1293 27.2358 13.7523 27.2358 13.269C27.2358 12.9017 27.3324 12.5923 27.5258 12.341C27.7384 12.0703 27.9704 11.8577 28.2218 11.703C28.0864 11.5097 27.8834 11.413 27.6128 11.413C27.0134 11.413 26.4624 11.5967 25.9598 11.964C25.4571 12.312 25.0318 12.7663 24.6838 13.327C24.3358 13.8877 24.0651 14.487 23.8718 15.125C23.6784 15.7437 23.5818 16.3237 23.5818 16.865V23.013C23.5818 23.9603 23.8524 24.5983 24.3938 24.927C24.9544 25.2363 25.7084 25.391 26.6558 25.391V26C26.2111 25.9807 25.5828 25.9613 24.7708 25.942C23.9588 25.9033 23.0984 25.884 22.1898 25.884C21.5324 25.884 20.8751 25.9033 20.2178 25.942C19.5798 25.9613 19.0964 25.9807 18.7678 26V25.391C19.5604 25.391 20.1211 25.246 20.4498 24.956C20.7978 24.666 20.9718 24.115 20.9718 23.303V14.226C20.9718 13.356 20.8171 12.718 20.5078 12.312C20.1984 11.8867 19.6184 11.674 18.7678 11.674V11.065C19.3864 11.123 19.9858 11.152 20.5658 11.152C21.1264 11.152 21.6581 11.123 22.1608 11.065C22.6828 10.9877 23.1564 10.8813 23.5818 10.746V14.371C23.7944 13.8103 24.0941 13.2497 24.4808 12.689C24.8868 12.109 25.3701 11.6257 25.9308 11.239C26.4914 10.8523 27.1101 10.659 27.7868 10.659ZM34.9878 3.815C35.4905 3.815 35.9255 3.99867 36.2928 4.366C36.6602 4.73333 36.8438 5.16833 36.8438 5.671C36.8438 6.17367 36.6602 6.60867 36.2928 6.976C35.9255 7.34333 35.4905 7.527 34.9878 7.527C34.4852 7.527 34.0502 7.34333 33.6828 6.976C33.3155 6.60867 33.1318 6.17367 33.1318 5.671C33.1318 5.16833 33.3155 4.73333 33.6828 4.366C34.0502 3.99867 34.4852 3.815 34.9878 3.815ZM36.4958 10.746V23.303C36.4958 24.115 36.6602 24.666 36.9888 24.956C37.3368 25.246 37.9072 25.391 38.6998 25.391V26C38.3712 25.9807 37.8685 25.9613 37.1918 25.942C36.5345 25.9033 35.8675 25.884 35.1908 25.884C34.5335 25.884 33.8665 25.9033 33.1898 25.942C32.5132 25.9613 32.0105 25.9807 31.6818 26V25.391C32.4745 25.391 33.0352 25.246 33.3638 24.956C33.7118 24.666 33.8858 24.115 33.8858 23.303V14.226C33.8858 13.356 33.7312 12.718 33.4218 12.312C33.1125 11.8867 32.5325 11.674 31.6818 11.674V11.065C32.3005 11.123 32.8998 11.152 33.4798 11.152C34.0405 11.152 34.5722 11.123 35.0748 11.065C35.5968 10.9877 36.0705 10.8813 36.4958 10.746ZM45.5139 31.452C44.4892 31.452 43.5226 31.3457 42.6139 31.133C41.7052 30.9203 40.9706 30.582 40.4099 30.118C39.8686 29.6733 39.5979 29.103 39.5979 28.407C39.5979 27.7303 39.8686 27.1503 40.4099 26.667C40.9512 26.1837 41.6859 25.8163 42.6139 25.565L42.7879 26.029C42.3626 26.1643 42.0242 26.435 41.7729 26.841C41.5216 27.247 41.3959 27.7013 41.3959 28.204C41.3959 29.0933 41.8019 29.77 42.6139 30.234C43.4452 30.7173 44.5182 30.959 45.8329 30.959C46.7029 30.959 47.5536 30.843 48.3849 30.611C49.2162 30.3983 49.9026 30.031 50.4439 29.509C50.9852 28.987 51.2559 28.3007 51.2559 27.45C51.2559 26.812 51.0239 26.29 50.5599 25.884C50.1152 25.4587 49.2259 25.246 47.8919 25.246H45.7459C45.1272 25.246 44.5279 25.1977 43.9479 25.101C43.3679 25.0043 42.8942 24.8013 42.5269 24.492C42.1596 24.1827 41.9759 23.709 41.9759 23.071C41.9759 22.4137 42.2466 21.7853 42.7879 21.186C43.3292 20.5673 44.3249 19.939 45.7749 19.301L46.1229 19.562C45.4656 19.91 44.8952 20.2677 44.4119 20.635C43.9286 20.983 43.6869 21.3987 43.6869 21.882C43.6869 22.5007 44.1509 22.81 45.0789 22.81H48.7039C49.5159 22.81 50.2602 22.926 50.9369 23.158C51.6329 23.39 52.1936 23.7573 52.6189 24.26C53.0442 24.7627 53.2569 25.42 53.2569 26.232C53.2569 27.1407 52.9669 27.9913 52.3869 28.784C51.8069 29.5767 50.9369 30.2147 49.7769 30.698C48.6362 31.2007 47.2152 31.452 45.5139 31.452ZM45.6589 19.823C44.7116 19.823 43.8512 19.6683 43.0779 19.359C42.3046 19.0303 41.6956 18.5277 41.2509 17.851C40.8062 17.1743 40.5839 16.3043 40.5839 15.241C40.5839 14.1777 40.8062 13.3077 41.2509 12.631C41.6956 11.9543 42.3046 11.4613 43.0779 11.152C43.8512 10.8233 44.7116 10.659 45.6589 10.659C46.6256 10.659 47.4859 10.8233 48.2399 11.152C49.0132 11.4613 49.6222 11.9543 50.0669 12.631C50.5116 13.3077 50.7339 14.1777 50.7339 15.241C50.7339 16.3043 50.5116 17.1743 50.0669 17.851C49.6222 18.5277 49.0132 19.0303 48.2399 19.359C47.4859 19.6683 46.6256 19.823 45.6589 19.823ZM45.6589 19.301C46.3936 19.301 46.9639 19.011 47.3699 18.431C47.7952 17.851 48.0079 16.7877 48.0079 15.241C48.0079 13.6943 47.7952 12.631 47.3699 12.051C46.9639 11.471 46.3936 11.181 45.6589 11.181C44.9436 11.181 44.3732 11.471 43.9479 12.051C43.5226 12.631 43.3099 13.6943 43.3099 15.241C43.3099 16.7877 43.5226 17.851 43.9479 18.431C44.3732 19.011 44.9436 19.301 45.6589 19.301ZM49.8349 13.066L49.3129 12.863C49.5836 12.2057 50.0476 11.6257 50.7049 11.123C51.3622 10.6203 52.0486 10.369 52.7639 10.369C53.2666 10.369 53.6726 10.514 53.9819 10.804C54.2912 11.0747 54.4459 11.4903 54.4459 12.051C54.4459 12.6503 54.2816 13.0757 53.9529 13.327C53.6436 13.559 53.3246 13.675 52.9959 13.675C52.7059 13.675 52.4352 13.5783 52.1839 13.385C51.9326 13.1723 51.7876 12.8437 51.7489 12.399C51.7102 11.9543 51.8456 11.384 52.1549 10.688L52.5319 10.775C51.7199 11.0843 51.1399 11.413 50.7919 11.761C50.4439 12.0897 50.1249 12.5247 49.8349 13.066ZM60.0522 3.293V14.139C60.5549 12.8243 61.2509 11.9157 62.1402 11.413C63.0489 10.9103 63.9962 10.659 64.9822 10.659C65.7169 10.659 66.3259 10.7557 66.8092 10.949C67.3119 11.1423 67.7275 11.413 68.0562 11.761C68.4235 12.1477 68.6845 12.631 68.8392 13.211C68.9939 13.791 69.0712 14.574 69.0712 15.56V23.303C69.0712 24.115 69.2355 24.666 69.5642 24.956C69.9122 25.246 70.4825 25.391 71.2752 25.391V26C70.9465 25.9807 70.4439 25.9613 69.7672 25.942C69.0905 25.9033 68.4332 25.884 67.7952 25.884C67.1572 25.884 66.5289 25.9033 65.9102 25.942C65.3109 25.9613 64.8565 25.9807 64.5472 26V25.391C65.2432 25.391 65.7362 25.246 66.0262 24.956C66.3162 24.666 66.4612 24.115 66.4612 23.303V14.922C66.4612 14.3227 66.4129 13.7717 66.3162 13.269C66.2195 12.7663 65.9972 12.3603 65.6492 12.051C65.3205 11.7417 64.8082 11.587 64.1122 11.587C63.3195 11.587 62.6139 11.8093 61.9952 12.254C61.3959 12.6987 60.9222 13.3173 60.5742 14.11C60.2262 14.9027 60.0522 15.8113 60.0522 16.836V23.303C60.0522 24.115 60.1972 24.666 60.4872 24.956C60.7772 25.246 61.2702 25.391 61.9662 25.391V26C61.6569 25.9807 61.1929 25.9613 60.5742 25.942C59.9749 25.9033 59.3562 25.884 58.7182 25.884C58.0802 25.884 57.4229 25.9033 56.7462 25.942C56.0695 25.9613 55.5669 25.9807 55.2382 26V25.391C56.0309 25.391 56.5915 25.246 56.9202 24.956C57.2682 24.666 57.4422 24.115 57.4422 23.303V6.773C57.4422 5.903 57.2875 5.265 56.9782 4.859C56.6689 4.43367 56.0889 4.221 55.2382 4.221V3.612C55.8569 3.67 56.4562 3.699 57.0362 3.699C57.5969 3.699 58.1285 3.67 58.6312 3.612C59.1532 3.53467 59.6269 3.42833 60.0522 3.293ZM77.217 6.251V11.094H81.509V11.674H77.217V22.897C77.217 23.8057 77.3814 24.4437 77.71 24.811C78.0387 25.1783 78.493 25.362 79.073 25.362C79.653 25.362 80.1557 25.13 80.581 24.666C81.0064 24.1827 81.3737 23.3803 81.683 22.259L82.263 22.404C82.0697 23.5253 81.683 24.4727 81.103 25.246C80.5424 26.0193 79.6724 26.406 78.493 26.406C77.8357 26.406 77.2944 26.319 76.869 26.145C76.4437 25.9903 76.0667 25.7583 75.738 25.449C75.3127 25.0043 75.013 24.4727 74.839 23.854C74.6844 23.2353 74.607 22.4137 74.607 21.389V11.674H71.823V11.094H74.607V6.657C75.0904 6.63767 75.5544 6.599 75.999 6.541C76.4437 6.483 76.8497 6.38633 77.217 6.251ZM89.847 10.659C91.5483 10.659 92.8727 11.181 93.82 12.225C94.7867 13.2497 95.27 14.8543 95.27 17.039H85.033L85.004 16.488H92.486C92.5247 15.5407 92.4473 14.6707 92.254 13.878C92.0607 13.066 91.7513 12.4183 91.326 11.935C90.92 11.4517 90.3883 11.21 89.731 11.21C88.8417 11.21 88.049 11.6547 87.353 12.544C86.6763 13.4333 86.2703 14.8447 86.135 16.778L86.222 16.894C86.1833 17.184 86.1543 17.503 86.135 17.851C86.1157 18.199 86.106 18.547 86.106 18.895C86.106 20.2097 86.3187 21.3407 86.744 22.288C87.1693 23.2353 87.7203 23.9603 88.397 24.463C89.093 24.9463 89.8083 25.188 90.543 25.188C91.123 25.188 91.674 25.101 92.196 24.927C92.718 24.7337 93.2013 24.4243 93.646 23.999C94.0907 23.5737 94.4773 23.0033 94.806 22.288L95.386 22.52C95.1733 23.158 94.8253 23.7767 94.342 24.376C93.8587 24.9753 93.2497 25.4683 92.515 25.855C91.7803 26.2223 90.9297 26.406 89.963 26.406C88.571 26.406 87.3723 26.087 86.367 25.449C85.381 24.811 84.6173 23.9313 84.076 22.81C83.554 21.6693 83.293 20.3643 83.293 18.895C83.293 17.1937 83.5637 15.734 84.105 14.516C84.6463 13.2787 85.41 12.3313 86.396 11.674C87.382 10.9973 88.5323 10.659 89.847 10.659ZM106.489 10.659C107.011 10.659 107.465 10.7653 107.852 10.978C108.258 11.1907 108.567 11.471 108.78 11.819C109.012 12.1477 109.128 12.5247 109.128 12.95C109.128 13.4333 108.973 13.8587 108.664 14.226C108.374 14.5933 107.978 14.777 107.475 14.777C107.069 14.777 106.711 14.6513 106.402 14.4C106.093 14.1293 105.938 13.7523 105.938 13.269C105.938 12.9017 106.035 12.5923 106.228 12.341C106.441 12.0703 106.673 11.8577 106.924 11.703C106.789 11.5097 106.586 11.413 106.315 11.413C105.716 11.413 105.165 11.5967 104.662 11.964C104.159 12.312 103.734 12.7663 103.386 13.327C103.038 13.8877 102.767 14.487 102.574 15.125C102.381 15.7437 102.284 16.3237 102.284 16.865V23.013C102.284 23.9603 102.555 24.5983 103.096 24.927C103.657 25.2363 104.411 25.391 105.358 25.391V26C104.913 25.9807 104.285 25.9613 103.473 25.942C102.661 25.9033 101.801 25.884 100.892 25.884C100.235 25.884 99.5772 25.9033 98.9199 25.942C98.2819 25.9613 97.7986 25.9807 97.4699 26V25.391C98.2626 25.391 98.8232 25.246 99.1519 24.956C99.4999 24.666 99.6739 24.115 99.6739 23.303V14.226C99.6739 13.356 99.5192 12.718 99.2099 12.312C98.9006 11.8867 98.3206 11.674 97.4699 11.674V11.065C98.0886 11.123 98.6879 11.152 99.2679 11.152C99.8286 11.152 100.36 11.123 100.863 11.065C101.385 10.9877 101.859 10.8813 102.284 10.746V14.371C102.497 13.8103 102.796 13.2497 103.183 12.689C103.589 12.109 104.072 11.6257 104.633 11.239C105.194 10.8523 105.812 10.659 106.489 10.659Z" fill="currentColor" />
        <path d="M61.431 34.225C61.431 35.559 61.228 36.8833 60.822 38.198C60.4353 39.5127 59.8553 40.7597 59.082 41.939C58.3087 43.1183 57.3517 44.1623 56.211 45.071C55.0703 45.9797 53.7557 46.695 52.267 47.217C50.7977 47.739 49.1447 48 47.308 48C47.018 48 46.641 47.9903 46.177 47.971C45.713 47.9517 45.2103 47.942 44.669 47.942C44.147 47.9227 43.6057 47.913 43.045 47.913C42.6003 47.913 42.117 47.9227 41.595 47.942C41.073 47.942 40.58 47.9517 40.116 47.971C39.6713 47.971 39.2943 47.9807 38.985 48L39.072 47.42C39.6907 47.3813 40.174 47.304 40.522 47.188C40.8893 47.072 41.1793 46.84 41.392 46.492C41.6047 46.144 41.798 45.622 41.972 44.926L45.771 30.542C45.9257 29.962 45.9933 29.498 45.974 29.15C45.974 28.7827 45.829 28.512 45.539 28.338C45.2683 28.164 44.785 28.0673 44.089 28.048L44.176 27.468C44.5047 27.4873 44.9107 27.5067 45.394 27.526C45.8773 27.5453 46.3897 27.555 46.931 27.555C47.4917 27.555 48.0233 27.555 48.526 27.555C48.8933 27.5357 49.3477 27.526 49.889 27.526C50.4303 27.5067 50.9717 27.497 51.513 27.497C52.0543 27.4777 52.5087 27.468 52.876 27.468C55.66 27.468 57.777 28.0383 59.227 29.179C60.6963 30.3197 61.431 32.0017 61.431 34.225ZM47.192 47.478C48.526 47.478 49.7247 47.217 50.788 46.695C51.8707 46.173 52.818 45.448 53.63 44.52C54.4613 43.592 55.1477 42.5287 55.689 41.33C56.2497 40.1313 56.6653 38.8553 56.936 37.502C57.226 36.1293 57.371 34.7567 57.371 33.384C57.371 31.6053 56.965 30.2617 56.153 29.353C55.341 28.4443 54.0167 27.99 52.18 27.99C51.658 27.99 51.252 28.0577 50.962 28.193C50.672 28.309 50.44 28.5507 50.266 28.918C50.092 29.266 49.918 29.788 49.744 30.484L45.945 44.984C45.771 45.5833 45.6647 46.0667 45.626 46.434C45.6067 46.8013 45.713 47.072 45.945 47.246C46.177 47.4007 46.5927 47.478 47.192 47.478ZM66.5889 47.072C66.9369 47.072 67.3333 46.869 67.7779 46.463C68.2226 46.0377 68.6769 45.448 69.1409 44.694C69.6049 43.94 70.0496 43.041 70.4749 41.997C70.9003 40.953 71.2676 39.8123 71.5769 38.575L70.9679 41.707C70.4073 43.3503 69.8079 44.665 69.1699 45.651C68.5513 46.637 67.8939 47.3427 67.1979 47.768C66.5213 48.1933 65.8156 48.406 65.0809 48.406C64.0369 48.406 63.2636 48.087 62.7609 47.449C62.2583 46.7917 62.0069 45.9217 62.0069 44.839C62.0069 43.8337 62.1713 42.78 62.4999 41.678C62.8286 40.5567 63.2829 39.4643 63.8629 38.401C64.4623 37.3183 65.1389 36.3517 65.8929 35.501C66.6469 34.631 67.4493 33.935 68.2999 33.413C69.1506 32.891 70.0013 32.63 70.8519 32.63C71.5093 32.63 72.0119 32.9103 72.3599 33.471C72.7079 34.0123 72.7949 34.8437 72.6209 35.965L72.3019 36.139C72.4373 35.327 72.3986 34.689 72.1859 34.225C71.9926 33.761 71.6639 33.529 71.1999 33.529C70.7553 33.529 70.2816 33.761 69.7789 34.225C69.2956 34.689 68.8123 35.3173 68.3289 36.11C67.8456 36.9027 67.4009 37.8017 66.9949 38.807C66.6083 39.8123 66.2989 40.8563 66.0669 41.939C65.8349 43.0217 65.7189 44.0753 65.7189 45.1C65.7189 45.8153 65.7866 46.3277 65.9219 46.637C66.0766 46.927 66.2989 47.072 66.5889 47.072ZM73.1139 33.036C73.8099 33.0167 74.4576 32.978 75.0569 32.92C75.6756 32.862 76.2653 32.7653 76.8259 32.63L73.0849 45.506C73.0076 45.738 72.9496 45.9797 72.9109 46.231C72.8916 46.463 72.9109 46.666 72.9689 46.84C73.0463 46.9947 73.2106 47.072 73.4619 47.072C73.7713 47.072 74.0903 46.9077 74.4189 46.579C74.7476 46.2503 75.0859 45.5833 75.4339 44.578L75.8689 43.273H76.4199L75.6949 45.39C75.4243 46.1827 75.0859 46.8013 74.6799 47.246C74.2739 47.6713 73.8389 47.971 73.3749 48.145C72.9303 48.319 72.4856 48.406 72.0409 48.406C71.1129 48.406 70.4556 48.116 70.0689 47.536C69.8176 47.1107 69.7209 46.5887 69.7789 45.97C69.8369 45.3513 69.9626 44.6843 70.1559 43.969L73.1139 33.036ZM86.4503 46.434L83.7533 49.479L81.4333 35.559C81.356 34.9983 81.2593 34.6117 81.1433 34.399C81.0273 34.1863 80.863 34.08 80.6503 34.08C80.4376 34.08 80.2153 34.2347 79.9833 34.544C79.7706 34.834 79.4903 35.4623 79.1423 36.429L78.6783 37.705H78.1273L78.8523 35.588C79.2583 34.4087 79.761 33.6257 80.3603 33.239C80.979 32.833 81.646 32.63 82.3613 32.63C83.0766 32.63 83.647 32.8427 84.0723 33.268C84.517 33.674 84.8166 34.457 84.9713 35.617L86.4503 46.434ZM79.7223 52.031C80.5923 51.6057 81.501 51.0063 82.4483 50.233C83.415 49.479 84.4106 48.4543 85.4353 47.159C86.518 45.767 87.4846 44.259 88.3353 42.635C89.2053 40.9917 89.8336 39.387 90.2203 37.821C89.795 37.589 89.3793 37.3087 88.9733 36.98C88.5866 36.632 88.2676 36.2453 88.0163 35.82C87.7843 35.3753 87.6683 34.9017 87.6683 34.399C87.707 33.8383 87.881 33.4033 88.1903 33.094C88.519 32.7847 88.9443 32.63 89.4663 32.63C90.085 32.63 90.5393 32.8523 90.8293 33.297C91.1193 33.7223 91.2643 34.341 91.2643 35.153C91.2643 36.1003 91.1 37.125 90.7713 38.227C90.462 39.329 90.0366 40.46 89.4953 41.62C88.954 42.7607 88.3353 43.8723 87.6393 44.955C86.9626 46.0183 86.2666 47.0043 85.5513 47.913C85.0293 48.5317 84.43 49.16 83.7533 49.798C83.096 50.436 82.3613 51.0257 81.5493 51.567C80.7566 52.1277 79.906 52.582 78.9973 52.93C78.5333 53.1233 78.1176 53.2587 77.7503 53.336C77.383 53.4133 77.0736 53.452 76.8223 53.452C76.281 53.452 75.8363 53.3167 75.4883 53.046C75.1403 52.7947 74.9663 52.437 74.9663 51.973C74.9663 51.4897 75.15 51.0933 75.5173 50.784C75.8653 50.494 76.31 50.349 76.8513 50.349C77.3926 50.349 77.8953 50.5037 78.3593 50.813C78.8426 51.1223 79.297 51.5283 79.7223 52.031ZM93.7705 47.565C93.9252 47.6423 94.0895 47.71 94.2635 47.768C94.4375 47.8067 94.6792 47.826 94.9885 47.826C95.7232 47.826 96.3322 47.594 96.8155 47.13C97.3182 46.6467 97.5695 45.9797 97.5695 45.129C97.5695 44.5103 97.4342 43.882 97.1635 43.244C96.9122 42.606 96.5255 41.9003 96.0035 41.127C95.5395 40.4503 95.1142 39.7833 94.7275 39.126C94.3602 38.4687 94.1765 37.7147 94.1765 36.864C94.1765 36.0327 94.3795 35.3077 94.7855 34.689C95.1915 34.051 95.7715 33.5483 96.5255 33.181C97.2795 32.8137 98.1592 32.63 99.1645 32.63C99.8219 32.63 100.47 32.7073 101.108 32.862C101.746 33.0167 102.268 33.297 102.674 33.703C103.08 34.109 103.283 34.6987 103.283 35.472C103.283 35.7427 103.225 36.0327 103.109 36.342C102.993 36.632 102.819 36.8833 102.587 37.096C102.355 37.3087 102.045 37.415 101.659 37.415C101.253 37.415 100.914 37.2603 100.644 36.951C100.373 36.6223 100.238 36.2067 100.238 35.704C100.238 35.2593 100.315 34.8437 100.47 34.457C100.644 34.0703 100.847 33.732 101.079 33.442C100.808 33.2873 100.421 33.21 99.9185 33.21C99.2225 33.21 98.6619 33.4323 98.2365 33.877C97.8112 34.3217 97.5985 34.95 97.5985 35.762C97.5985 36.1873 97.6662 36.5933 97.8015 36.98C97.9562 37.3473 98.1592 37.734 98.4105 38.14C98.6812 38.5267 98.9809 38.981 99.3095 39.503C99.8509 40.373 100.276 41.156 100.586 41.852C100.895 42.5287 101.05 43.2247 101.05 43.94C101.05 44.7907 100.818 45.5543 100.354 46.231C99.9089 46.9077 99.2902 47.4393 98.4975 47.826C97.7049 48.2127 96.7769 48.406 95.7135 48.406C94.9595 48.406 94.2345 48.2997 93.5385 48.087C92.8619 47.8937 92.3012 47.565 91.8565 47.101C91.4312 46.637 91.2185 45.999 91.2185 45.187C91.2185 44.7423 91.3442 44.3363 91.5955 43.969C91.8275 43.5823 92.1949 43.389 92.6975 43.389C93.2002 43.389 93.5772 43.592 93.8285 43.998C94.0799 44.404 94.2055 44.9067 94.2055 45.506C94.2055 45.9313 94.1475 46.3277 94.0315 46.695C93.9349 47.043 93.8479 47.333 93.7705 47.565ZM103.55 46.753C103.55 46.0377 103.801 45.4287 104.304 44.926C104.826 44.4233 105.435 44.172 106.131 44.172C106.692 44.172 107.127 44.3267 107.436 44.636C107.765 44.9453 107.929 45.361 107.929 45.883C107.929 46.3277 107.813 46.7433 107.581 47.13C107.349 47.4973 107.03 47.797 106.624 48.029C106.237 48.2803 105.802 48.406 105.319 48.406C104.778 48.406 104.343 48.261 104.014 47.971C103.705 47.6617 103.55 47.2557 103.55 46.753Z" fill="currentColor" />
      </svg>
    </a>
  );
}

function FullMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [entered, setEntered] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (open) {
      setInstant(false);
      const raf1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      return () => cancelAnimationFrame(raf1);
    }
    setEntered(false);
  }, [open]);

  function closeInstant() {
    setInstant(true);
    onClose();
  }

  const linkClass = "reveal serif border-b border-[#232426]/12 py-4 text-[38px] leading-[.9] tracking-[-.03em] transition hover:text-[#232426]/60";
  const noTransition = instant ? { transition: 'none' } : undefined;

  return (
    <div className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`}>
      <button type="button" onClick={closeInstant} aria-label="Close menu" style={noTransition} className={`absolute inset-0 bg-[#141413]/40 transition-opacity duration-300 ${entered ? 'opacity-100' : 'opacity-0'}`} />
      <div style={noTransition} className={`absolute right-0 top-[72px] flex h-[calc(100%-72px)] w-[82%] max-w-[380px] flex-col overflow-y-auto bg-[#f6f4ef] px-6 py-6 text-[#232426] shadow-2xl transition-transform duration-300 ease-out sm:top-[80px] sm:h-[calc(100%-80px)] sm:px-9 sm:py-7 ${entered ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-1 flex-col">
          <div className="flex-1" />
          <nav aria-label="Full site menu" className="flex flex-col gap-1">
            {menuLinks.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={closeInstant}
                data-testid={`link-menu-${item.label.toLowerCase()}`}
                className={linkClass}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.instagram.com/brighterdaysto.photo/"
              target="_blank"
              rel="noreferrer"
              onClick={closeInstant}
              aria-label="Instagram"
              data-testid="link-menu-instagram"
              className="reveal flex items-center border-b border-[#232426]/12 py-4 text-[#232426] transition hover:text-[#232426]/60"
              style={{ animationDelay: `${menuLinks.length * 0.06}s` }}
            >
              <Instagram size={34} />
            </a>
          </nav>
          <div className="flex-[2]" />
        </div>
        <div className="flex flex-col gap-4 border-t border-[#232426]/12 pt-6">
          <a href="mailto:hello@brighterdaystophoto.com" data-testid="link-menu-email" className="label flex items-center gap-2 text-[11px] tracking-[.18em] text-[#232426]">
            <Mail size={14} /> hello@brighterdaystophoto.com
          </a>
        </div>
      </div>
    </div>
  );
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myezgzjl';

const hearAboutOptions = ['Instagram', 'Google search', 'Pinterest', 'Referral from a friend', 'Vendor referral', 'Other'];

function buildHearAboutSummary(selected: string[], otherText: string, referralName: string, vendorName: string) {
  if (selected.length === 0) return 'Not provided';
  return selected
    .map((o) => {
      if (o === 'Other' && otherText.trim()) return `Other: ${otherText.trim()}`;
      if (o === 'Referral from a friend' && referralName.trim()) return `Referral from a friend (${referralName.trim()})`;
      if (o === 'Vendor referral' && vendorName.trim()) return `Vendor referral (${vendorName.trim()})`;
      return o;
    })
    .join(', ');
}

function InquiryModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [hearAboutError, setHearAboutError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', type: '', day: '', month: '', year: '', address: '', note: '', hearAbout: [] as string[], hearAboutOther: '', referralName: '', vendorName: '', company: '' });
  const needsAddress = form.type === 'Wedding' || form.type === 'Event';
  const formRef = useRef<HTMLFormElement>(null);

  function goToStep2(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    setStep(2);
  }

  function toggleHearAbout(option: string) {
    setHearAboutError('');
    setForm((f) => ({
      ...f,
      hearAbout: f.hearAbout.includes(option) ? f.hearAbout.filter((o) => o !== option) : [...f.hearAbout, option],
    }));
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.company) {
      setSent(true);
      return;
    }
    if (form.hearAbout.length === 0) {
      setHearAboutError('Please select at least one option.');
      return;
    }
    if (form.hearAbout.includes('Other') && !form.hearAboutOther.trim()) {
      setHearAboutError('Please tell us where.');
      return;
    }
    setHearAboutError('');
    setSubmitting(true);
    setSubmitError(false);
    try {
      const eventDate = [form.month, form.day, form.year].filter(Boolean).join(' ');
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New inquiry from ${form.firstName} ${form.lastName}`.trim(),
          _gotcha: form.company,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email.trim(),
          sessionType: form.type,
          eventDate: eventDate || 'Not provided',
          venueAddress: form.address || 'Not provided',
          message: form.note,
          hearAbout: buildHearAboutSummary(form.hearAbout, form.hearAboutOther, form.referralName, form.vendorName),
        }),
      });
      if (response.ok) {
        setSent(true);
      } else {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,16,18,.6)] p-5 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[92dvh] w-full overflow-hidden bg-[#f6f4ef] shadow-2xl sm:max-w-[560px] md:max-w-[1040px]">
        <div className="hidden shrink-0 md:block md:w-1/2">
          <img src={danceImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative w-full overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
        <button type="button" onClick={onClose} aria-label="Close inquiry form" data-testid="button-close-inquiry" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-[#cfcdc6] text-[#232426] transition hover:bg-[#eae8e2]">
          <X size={16} strokeWidth={1.5} />
        </button>
        {!sent ? (
          <>
            <p className="label mb-3 text-[10px] uppercase tracking-[.24em] text-[#8b8a84]">Start a conversation</p>
            <h2 id="inquiry-title" className={`serif max-w-[420px] text-[30px] leading-[1] text-[#232426] sm:text-[38px] ${step === 2 ? 'mb-7' : ''}`}>{step === 1 ? 'Tell me about it.' : 'How did you hear about us?'}</h2>
            {step === 1 && <p className="mt-2 max-w-[430px] text-[13px] leading-5 text-[#6e6d67]">A few details are plenty for now. I’ll be in touch within two business days.</p>}
            <form ref={formRef} onSubmit={step === 1 ? goToStep2 : submitInquiry} className="mt-5 space-y-3">
              <div className={step === 1 ? 'space-y-3' : 'hidden'}>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">First name *</span><input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} data-testid="input-inquiry-first-name" className="w-full border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="First" /></label>
                  <label className="block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">Last name</span><input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} data-testid="input-inquiry-last-name" className="w-full border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="Last" /></label>
                </div>
                <label className="block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">Email *</span><input required type="email" pattern="[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}" title="Enter a full email address, like you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="input-inquiry-email" className="w-full border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="you@example.com" /></label>
                <input type="text" name="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" />
                <label className="block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">Date (if you have one)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} data-testid="select-inquiry-day" style={selectArrowStyle} className="w-full appearance-none border border-[#cfcdc6] bg-[#faf9f5] bg-no-repeat py-2 pl-3 pr-7 text-sm text-[#232426] outline-none transition-colors focus:border-[#232426]">
                      <option value="">Day</option>
                      {days.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} data-testid="select-inquiry-month" style={selectArrowStyle} className="w-full appearance-none border border-[#cfcdc6] bg-[#faf9f5] bg-no-repeat py-2 pl-3 pr-7 text-sm text-[#232426] outline-none transition-colors focus:border-[#232426]">
                      <option value="">Month</option>
                      {months.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} data-testid="select-inquiry-year" style={selectArrowStyle} className="w-full appearance-none border border-[#cfcdc6] bg-[#faf9f5] bg-no-repeat py-2 pl-3 pr-7 text-sm text-[#232426] outline-none transition-colors focus:border-[#232426]">
                      <option value="">Year</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </label>
                <label className="block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">What kind of session *</span>
                  <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} data-testid="select-inquiry-type" style={selectArrowStyle} className="w-full appearance-none border border-[#cfcdc6] bg-[#faf9f5] bg-no-repeat py-2 pl-3 pr-7 text-sm text-[#232426] outline-none transition-colors focus:border-[#232426]">
                    <option value="" disabled>Choose one</option>
                    {sessionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
                {needsAddress && (
                  <label className="block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">Venue address (if any)</span><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} data-testid="input-inquiry-address" className="w-full border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="Venue or location, if you know it" /></label>
                )}
                <label className="block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">A little about it *</span><textarea required value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} data-testid="input-inquiry-note" rows={4} className="w-full resize-none border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="The people, the place, the feeling..." /></label>
                <button type="submit" data-testid="button-next-inquiry" className="group mt-1 flex w-full items-center justify-between bg-[#232426] px-6 py-4 text-left text-sm text-[#f6f4ef] transition hover:bg-[#3a3a3d]">Next <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>
              </div>
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    {hearAboutOptions.map((o) => {
                      const checked = form.hearAbout.includes(o);
                      return (
                        <div key={o}>
                          <label className={`flex cursor-pointer items-center gap-2.5 border px-3 py-2 text-sm transition ${checked ? 'border-[#232426] bg-[#232426] text-[#f6f4ef]' : 'border-[#cfcdc6] bg-[#faf9f5] text-[#232426] hover:border-[#232426]/50'}`}>
                            <input type="checkbox" checked={checked} onChange={() => toggleHearAbout(o)} data-testid={`checkbox-hear-about-${o.toLowerCase().replace(/\s+/g, '-')}`} className="sr-only" />
                            <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${checked ? 'border-[#f6f4ef]' : 'border-[#8b8a84]'}`}>{checked && <Check size={9} />}</span>
                            {o}
                          </label>
                          {o === 'Referral from a friend' && checked && (
                            <label className="mt-2 block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">Who can we thank?</span><input value={form.referralName} onChange={(e) => setForm({ ...form, referralName: e.target.value })} data-testid="input-inquiry-referral-name" className="w-full border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="Their name" /></label>
                          )}
                          {o === 'Vendor referral' && checked && (
                            <label className="mt-2 block"><span className="label mb-1 block text-[10px] uppercase tracking-[.18em] text-[#6e6d67]">Which vendor?</span><input value={form.vendorName} onChange={(e) => setForm({ ...form, vendorName: e.target.value })} data-testid="input-inquiry-vendor-name" className="w-full border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="Vendor name" /></label>
                          )}
                          {o === 'Other' && checked && (
                            <input value={form.hearAboutOther} onChange={(e) => { setHearAboutError(''); setForm({ ...form, hearAboutOther: e.target.value }); }} data-testid="input-inquiry-hear-about-other" className="mt-2 w-full border border-[#cfcdc6] bg-[#faf9f5] px-3 py-2 text-sm text-[#232426] outline-none transition-colors placeholder:text-[#a6a49d] focus:border-[#232426]" placeholder="Tell us where" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {hearAboutError && <p className="text-sm text-[#b3443a]">{hearAboutError}</p>}
                  {submitError && <p className="text-sm text-[#b3443a]">Something went wrong sending that. Please try again, or email hello@brighterdaystophoto.com directly.</p>}
                  <div className="flex items-stretch gap-3">
                    <button type="button" onClick={() => setStep(1)} data-testid="button-back-inquiry" className="label flex items-center justify-center whitespace-nowrap border border-[#232426]/25 px-4 py-4 text-sm uppercase tracking-[.13em] text-[#232426] transition hover:bg-[#232426]/5 sm:px-6">Back</button>
                    <button type="submit" disabled={submitting} data-testid="button-submit-inquiry" className="group flex flex-1 items-center justify-between whitespace-nowrap bg-[#232426] px-4 py-4 text-left text-sm text-[#f6f4ef] transition hover:bg-[#3a3a3d] disabled:opacity-60 sm:px-6">{submitting ? 'Sending...' : 'Send message'} <ArrowUpRight size={17} className="ml-2 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="flex min-h-[320px] flex-col justify-center">
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#232426] text-[#f6f4ef]"><Check size={22} /></span>
            <p className="label mb-4 text-[10px] uppercase tracking-[.24em] text-[#8b8a84]">Note received</p>
            <h2 className="serif text-[36px] leading-[1] text-[#232426]">This is the beginning of something good.</h2>
            <p className="mt-4 max-w-[410px] text-sm leading-6 text-[#6e6d67]">Thank you, {form.firstName || 'there'}. Your note is safely with me. I’ll be back in your inbox soon.</p>
            <button type="button" onClick={onClose} data-testid="button-finish-inquiry" className="mt-6 flex w-fit items-center gap-3 border-b border-[#232426] pb-2 text-sm text-[#232426]">Close this window <ArrowRight size={15} /></button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerElevated, setHeaderElevated] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuBtnSize, setMenuBtnSize] = useState(40);
  const contactBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function syncMenuBtnSize() {
      if (contactBtnRef.current) setMenuBtnSize(contactBtnRef.current.offsetHeight);
    }
    syncMenuBtnSize();
    window.addEventListener('resize', syncMenuBtnSize);
    return () => window.removeEventListener('resize', syncMenuBtnSize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = inquiryOpen || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [inquiryOpen, menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      setHeaderElevated(true);
      return;
    }
    const timeout = setTimeout(() => setHeaderElevated(false), 300);
    return () => clearTimeout(timeout);
  }, [menuOpen]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function openInquiry() {
    setMenuOpen(false);
    setInquiryOpen(true);
  }

  return (
    <main className="site-noise overflow-hidden bg-white">
      <header className={`fixed left-0 right-0 top-0 px-5 py-3 transition-[background-color,color,box-shadow,backdrop-filter] duration-300 sm:px-9 sm:py-4 text-[#f6f4ef] ${headerElevated ? 'z-[75]' : 'z-40'} ${scrolled || headerElevated ? 'bg-[#232426] shadow-[0_1px_0_rgba(0,0,0,.25)]' : 'bg-transparent'}`}>
        <nav className="mx-auto flex max-w-[1380px] items-center justify-between" aria-label="Main navigation">
          <Logo />
          <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
            {navLinks.map((item) => <a key={item.href} href={item.href} {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})} data-testid={`link-nav-${item.label.toLowerCase()}`} className="label hidden text-[10px] uppercase tracking-[.18em] opacity-70 transition hover:opacity-100 md:block">{item.label}</a>)}
            <button ref={contactBtnRef} type="button" onClick={openInquiry} data-testid="button-nav-inquiry" className="label flex items-center gap-2 border border-[#f6f4ef] bg-[#f6f4ef] px-4 py-2.5 text-[9px] uppercase tracking-[.13em] text-[#232426] transition hover:bg-[#e8e6e0] sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[.15em]">Contact <ArrowUpRight size={13} /></button>
            <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-open-menu" style={{ width: menuBtnSize, height: menuBtnSize }} className="flex items-center justify-center border border-current/30 md:hidden">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <section id="top" className="dark-section relative flex min-h-[780px] items-end bg-[#232426] text-[#f6f4ef] sm:min-h-[860px]">
        <HeroSlider />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#232426]/92 via-[#232426]/10 to-[#232426]/25" />
        <div className="relative z-10 mx-auto w-full max-w-[1380px] px-5 pb-14 sm:px-9 sm:pb-20">
          <div className="max-w-[900px]">
            <p className="label reveal mb-6 text-[10px] uppercase tracking-[.25em] text-[#f6f4ef]/70">Toronto &amp; the GTA</p>
            <h1 className="serif reveal reveal-delay-1 max-w-[900px] text-[clamp(2.6rem,6.5vw,6.5rem)] leading-[.9] tracking-[-.03em] text-[#faf9f5]">Photos that feel<br /><i>like home.</i></h1>
          </div>
        </div>
        <span className="absolute bottom-7 right-6 hidden rotate-90 label text-[9px] uppercase tracking-[.25em] text-[#f6f4ef]/70 sm:block">Keep looking</span>
      </section>

      <section className="bg-[#f0f0ef] px-5 py-24 text-[#232426] sm:px-9 sm:py-32">
        <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[.7fr_1.4fr] md:gap-x-24 md:gap-y-0">
          <div className="contents md:block">
            <p className="order-1 label text-[10px] uppercase tracking-[.23em] text-[#232426]/55 md:order-none">A candid, unscripted<br />record of your day</p>
            <div className="order-3 relative mb-14 w-full max-w-[420px] md:order-none md:mb-0 md:mt-10">
              <div className="aspect-[4/5] overflow-hidden bg-[#c9c7c1]"><img src={portraitImage} alt="Candid portrait moment during a wedding" className="h-full w-full object-cover" /></div>
              <div className="absolute -bottom-4 -right-4 aspect-square w-[48%] overflow-hidden border-[8px] border-[#faf9f5] shadow-xl md:-bottom-10 md:-right-10"><img src={ringsImage} alt="Close detail photograph of hands and rings" className="h-full w-full object-cover" /></div>
            </div>
          </div>
          <div className="contents md:block">
            <h2 className="order-2 serif max-w-[800px] text-[clamp(2.8rem,6vw,6.5rem)] leading-[.95] tracking-[-.06em] text-[#232426] md:order-none">The big feeling is usually hiding in the <i>small things.</i></h2>
            <p className="order-4 max-w-[480px] text-[15px] leading-7 text-[#6e6d67] md:order-none md:mt-8">The hand that finds yours under the table. The look between siblings. A room full of people you love, moving as one. I shoot documentary-style, quietly, and true to how it actually looked, so you get the real day back, not a performance of it.</p>
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-10 bg-white px-5 py-24 sm:px-9 sm:py-36">
        <div className="mx-auto max-w-[1380px]">
          <div className="mb-14">
            <p className="label mb-4 text-[10px] uppercase tracking-[.23em] text-[#8b8a84]">Signature Work</p>
            <h2 className="serif text-[clamp(2.8rem,6vw,6.2rem)] leading-[.88] tracking-[-.06em] text-[#232426]">A Few <span className="font-semibold">Favourites</span></h2>
          </div>
          <div className="flex flex-col gap-7">
            <div className="grid gap-5 md:grid-cols-2 md:items-start md:gap-7">
              <a href="https://brighterdaystophoto.pixieset.com/amiras1stbirthday/" target="_blank" rel="noreferrer" data-testid="button-story-maple" className="group block w-full border-0 bg-transparent p-0 text-left">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#dad8d2]"><img src={amiraBirthdayImage} alt="Mother holding her daughter at a first birthday celebration" className="image-lift h-full w-full object-cover" /><span className="absolute left-4 top-4 bg-[#f6f4ef] px-3 py-2 label text-[9px] uppercase tracking-[.16em] text-[#232426]">Toronto / Family</span><span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f4ef] text-[#232426] opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={17} /></span></div>
                <div className="mt-4 flex justify-between gap-4 border-b border-[#d9d7d0] pb-4"><div><h3 className="serif text-[28px] leading-none text-[#232426]">Amira's First Birthday</h3><p className="mt-2 text-xs text-[#8b8a84]">A first birthday celebration</p></div><span className="label pt-2 text-[10px] text-[#8b8a84]">01</span></div>
              </a>
              <button type="button" onClick={openInquiry} data-testid="button-story-coast" className="group block w-full border-0 bg-transparent p-0 text-left md:mt-16">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#dad8d2]"><img src={coastalImage} alt="Couple standing together at a coastal ceremony" className="image-lift h-full w-full object-cover" /><span className="absolute left-4 top-4 bg-[#232426] px-3 py-2 label text-[9px] uppercase tracking-[.16em] text-[#f6f4ef]">Prince Edward County / Elopement</span><span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f4ef] text-[#232426] opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={17} /></span></div>
                <div className="mt-4 flex justify-between gap-4 border-b border-[#d9d7d0] pb-4"><div><h3 className="serif text-[28px] leading-none text-[#232426]">North of Here</h3><p className="mt-2 text-xs text-[#8b8a84]">Small, coastal elopement</p></div><span className="label pt-2 text-[10px] text-[#8b8a84]">02</span></div>
              </button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 md:items-start md:gap-7">
              <button type="button" onClick={openInquiry} data-testid="button-story-window" className="group block w-full border-0 bg-transparent p-0 text-left">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#dad8d2]"><img src={portraitImage} alt="Portrait session near a bright old window" className="image-lift h-full w-full object-cover" /><span className="absolute left-4 top-4 bg-[#f6f4ef] px-3 py-2 label text-[9px] uppercase tracking-[.16em] text-[#232426]">Toronto / Portrait</span><span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f4ef] text-[#232426] opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={17} /></span></div>
                <div className="mt-4 flex justify-between gap-4 border-b border-[#d9d7d0] pb-4"><div><h3 className="serif text-[28px] leading-none text-[#232426]">In the In-Between</h3><p className="mt-2 text-xs text-[#8b8a84]">A quiet portrait session</p></div><span className="label pt-2 text-[10px] text-[#8b8a84]">03</span></div>
              </button>
              <button type="button" onClick={openInquiry} data-testid="button-story-field" className="group block w-full border-0 bg-transparent p-0 text-left md:mt-16">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#dad8d2]"><img src={heroImage} alt="Couple walking together through golden-hour meadow grass" className="image-lift h-full w-full object-cover object-[62%]" /><span className="absolute left-4 top-4 bg-[#232426] px-3 py-2 label text-[9px] uppercase tracking-[.16em] text-[#f6f4ef]">Toronto / Engagement</span><span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f6f4ef] text-[#232426] opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={17} /></span></div>
                <div className="mt-4 flex justify-between gap-4 border-b border-[#d9d7d0] pb-4"><div><h3 className="serif text-[28px] leading-none text-[#232426]">Golden Hour</h3><p className="mt-2 text-xs text-[#8b8a84]">An evening engagement session</p></div><span className="label pt-2 text-[10px] text-[#8b8a84]">04</span></div>
              </button>
            </div>
          </div>
          <div className="mt-14 flex justify-center">
            <a href="https://brighterdaystophoto.pixieset.com/" target="_blank" rel="noreferrer" data-testid="button-gallery-more" className="label flex w-fit items-center gap-2 border border-[#232426]/25 px-6 py-3.5 text-[10px] uppercase tracking-[.16em] text-[#232426] transition hover:bg-[#232426] hover:text-[#f6f4ef]">See more work <ArrowUpRight size={13} /></a>
          </div>
        </div>
      </section>


      <section className="overflow-hidden bg-[#f0f0ef] py-6 sm:py-8">
        <div className="marquee-track flex w-max items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="serif whitespace-nowrap px-8 text-[clamp(2.6rem,9vw,6rem)] tracking-[-.02em] text-[#232426]">Engagement&nbsp;&nbsp;·&nbsp;&nbsp;Portrait&nbsp;&nbsp;·&nbsp;&nbsp;Family&nbsp;&nbsp;·&nbsp;&nbsp;Events&nbsp;&nbsp;·&nbsp;&nbsp;Wedding&nbsp;&nbsp;·</span>
          ))}
        </div>
      </section>

      <section id="about" className="scroll-mt-10 bg-white px-5 py-24 sm:px-9 sm:py-36">
        <div className="mx-auto grid max-w-[1180px] gap-14 md:grid-cols-[.9fr_1.1fr] md:items-center md:gap-28">
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute -bottom-5 -right-5 h-40 w-40 border border-[#232426] sm:-right-8 sm:h-52 sm:w-52" />
            <img src={aboutPortraitImage} alt="A quiet portrait, warmly and true-to-colour edited" className="relative aspect-[.78] w-full object-cover grayscale-[.15]" />
            <p className="absolute -bottom-3 -left-3 rotate-[-7deg] bg-[#232426] px-4 py-3 serif text-[18px] italic text-[#f6f4ef]">quietly, warmly, always true</p>
          </div>
          <div>
            <p className="label mb-6 text-[10px] uppercase tracking-[.23em] text-[#8b8a84]">A little about me</p>
            <h2 className="serif max-w-[680px] text-[clamp(2.9rem,6vw,6rem)] leading-[.91] tracking-[-.06em] text-[#232426]">I make room for the things you’ll <i>remember.</i></h2>
            <p className="mt-9 max-w-[480px] text-[15px] leading-7 text-[#6e6d67]">I’m the photographer behind Brighter Days, based in Toronto, shooting weddings, couples, portraits, families, and events across the GTA. I started this because I believe photographs don’t need to be perfect to be beautiful. They need to be true.</p>
            <p className="mt-5 max-w-[480px] text-[15px] leading-7 text-[#6e6d67]">Every set of photographs is edited true to colour and warm in tone: no heavy-handed presets, just the day as it actually looked, held onto a little longer.</p>
            <button type="button" onClick={openInquiry} data-testid="button-about-inquiry" className="group mt-9 flex w-fit items-center gap-3 bg-[#232426] px-7 py-4 label text-[10px] uppercase tracking-[.18em] text-[#f6f4ef] transition hover:bg-[#3a3a3d]">Let’s talk <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></button>
          </div>
        </div>
      </section>

      <footer className="dark-section bg-[#232426] px-5 py-10 text-[#f6f4ef] sm:px-9 sm:py-14">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex flex-col gap-7">
            <div className="contents md:flex md:flex-wrap md:items-start md:justify-between md:gap-6">
              <div className="order-1 md:order-none">
                <p className="label mb-4 text-[10px] uppercase tracking-[.23em] text-[#f6f4ef]/50">Your turn</p>
                <h2 className="serif max-w-[560px] text-[clamp(2.4rem,7vw,4.5rem)] leading-[.92] tracking-[-.03em] text-[#f6f4ef]">Time to make<br /><i>it official.</i></h2>
              </div>
              <button type="button" onClick={openInquiry} data-testid="button-footer-inquiry" className="group order-3 flex w-fit items-center gap-3 self-start bg-[#f6f4ef] px-7 py-4 label text-[10px] uppercase tracking-[.18em] text-[#232426] transition hover:bg-[#e8e6e0] md:order-none md:self-auto">Start an inquiry <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
            </div>
            <p className="serif order-2 max-w-[420px] text-[16px] leading-[1.5] text-[#f6f4ef]/55 md:order-none md:text-[18px]">Engagement / Portrait / Family / Events / Wedding photographs across Toronto and the GTA.</p>
          </div>
          <div className="mt-14 flex flex-col justify-between gap-3 border-t border-[#f6f4ef]/15 pt-5 sm:flex-row">
            <p className="label text-[9px] uppercase tracking-[.15em] text-[#f6f4ef]/40">© 2026 Brighter Days Toronto Photography</p>
            <a href="mailto:hello@brighterdaystophoto.com" data-testid="link-footer-contact" className="label flex items-center gap-2 text-[9px] tracking-[.15em] text-[#f6f4ef]/70">hello@brighterdaystophoto.com <Mail size={12} /></a>
          </div>
        </div>
      </footer>

      <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {inquiryOpen && <InquiryModal onClose={() => setInquiryOpen(false)} />}
    </main>
  );
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
