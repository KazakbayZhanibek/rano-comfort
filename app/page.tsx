import Hero        from '@/components/home/Hero'
import Categories  from '@/components/home/Categories'
import BestSellers from '@/components/home/BestSellers'
import WhyUs       from '@/components/home/WhyUs'
import Reviews     from '@/components/home/Reviews'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <BestSellers />
      <WhyUs />
      <Reviews />
    </main>
  )
}