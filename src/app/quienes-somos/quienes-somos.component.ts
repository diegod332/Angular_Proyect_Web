import { Component, HostListener, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quienes-somos',
  standalone: false,
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css'], 
})
export class QuienesSomosComponent implements OnInit {
  mostrarBoton: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initCarousel();
  }

  @HostListener('window:scroll', [])
    onWindowScroll(): void {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.mostrarBoton = scrollPosition > 400; 
    }

  redirectToOtherPage() {
    this.router.navigate(['/login']); 
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  initCarousel(): void {
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    setInterval(() => {
      items[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add('active');
    }, 2500); 
  }
}
