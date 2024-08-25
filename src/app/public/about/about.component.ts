import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  history = [
    {
      year: '2005',
      title: 'Fundación de la Empresa',
      description: 'Comenzamos con una pequeña oficina, mucha pasión y un sueño grande.',
      image: 'assets/images/history-2005.jpg'
    },
    {
      year: '2010',
      title: 'Primer Gran Proyecto',
      description: 'Nuestro primer gran cliente confió en nosotros para desarrollar su infraestructura digital.',
      image: 'assets/images/history-2010.jpg'
    },
    // Agrega más eventos aquí
  ];

  mission = 'Proveer soluciones innovadoras que transformen digitalmente a nuestros clientes.';
  vision = 'Ser líderes en la industria tecnológica a nivel global, impulsando la innovación y la excelencia.';
  values = [
    { name: 'Innovación', description: 'Impulsamos la creatividad y la búsqueda constante de nuevas ideas.' },
    { name: 'Excelencia', description: 'Nos comprometemos con la calidad en cada proyecto que emprendemos.' },
    { name: 'Integridad', description: 'Actuamos con ética y transparencia en todas nuestras relaciones.' },
  ];

  team = [
    { name: 'Ana Gómez', role: 'CEO', bio: 'Líder visionaria con más de 20 años de experiencia en la industria tecnológica.', photo: 'https://pbs.twimg.com/media/FOEFpoaXEAQNjf8.jpg:large' },
    { name: 'Carlos Rodríguez', role: 'CTO', bio: 'Experto en tecnología y desarrollo de software, siempre en busca de innovación.', photo: 'https://www.opinion.com.bo/media/opinion/images/2020/11/07/2020110718163917831.jpg' },
    // Agrega más miembros aquí
  ];

  achievements = [
    { title: 'Premio a la Innovación 2022', description: 'Reconocidos por nuestra contribución al desarrollo tecnológico en América Latina.' },
    { title: 'Certificación ISO 9001', description: 'Obtenida por nuestros altos estándares de calidad en gestión y desarrollo de proyectos.' },
    // Agrega más logros aquí
  ];

  initiatives = [
    { title: 'Educación para Todos', description: 'Iniciativa que apoya la educación en comunidades rurales.', image: 'assets/images/education.jpg' },
    { title: 'Tecnología Verde', description: 'Programas que promueven el uso responsable de recursos tecnológicos.', image: 'assets/images/green-tech.jpg' },
    // Agrega más iniciativas aquí
  ];
}
