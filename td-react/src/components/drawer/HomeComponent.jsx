import React from 'react';
import { Book, Users, Calendar, Award } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Book size={24} />,
      title: "Gestion des Cours",
      description: "Gérez facilement les cours, les emplois du temps et les ressources pédagogiques.",
      color: "#2563eb"
    },
    {
      icon: <Users size={24} />,
      title: "Suivi des Étudiants",
      description: "Suivez les progrès et les performances des étudiants en temps réel.",
      color: "#059669"
    },
    {
      icon: <Calendar size={24} />,
      title: "Planification",
      description: "Organisez les emplois du temps et les événements scolaires efficacement.",
      color: "#7c3aed"
    },
    {
      icon: <Award size={24} />,
      title: "Évaluation",
      description: "Gérez les notes, les examens et les bulletins de manière simplifiée.",
      color: "#db2777"
    }
  ];

  const stats = [
    { number: "1000+", label: "Étudiants" },
    { number: "50+", label: "Enseignants" },
    { number: "100+", label: "Cours" },
    { number: "95%", label: "Taux de Réussite" }
  ];

  return (
    <div className="container">
      <div className="hero">
        <h1 className="title">Bienvenue sur Scolarité</h1>
        <p className="subtitle">
          Votre plateforme moderne de gestion scolaire. Simplifiez l'administration, 
          améliorez la communication et optimisez le suivi des étudiants.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="icon-wrapper" style={{ backgroundColor: feature.color }}>
              {feature.icon}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f8fb 0%, #e9eef5 100%);
        }

        .hero {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          text-align: center;
        }

        .title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .subtitle {
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0.9;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          color: white;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1a202c;
        }

        .feature-description {
          color: #4a5568;
          line-height: 1.6;
        }

        .stats-section {
          background: white;
          padding: 4rem 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #4a5568;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 3rem 1rem;
          }

          .title {
            font-size: 2.5rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .features-grid {
            padding: 2rem 1rem;
            gap: 1.5rem;
          }

          .stats-section {
            padding: 2rem 1rem;
          }

          .stats-grid {
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 2rem 1rem;
          }

          .title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .features-grid {
            padding: 1.5rem 1rem;
            gap: 1rem;
          }

          .feature-card {
            padding: 1.5rem;
          }

          .icon-wrapper {
            width: 40px;
            height: 40px;
          }

          .feature-title {
            font-size: 1.1rem;
          }

          .feature-description {
            font-size: 0.95rem;
          }

          .stats-section {
            padding: 1.5rem 1rem;
          }

          .stats-grid {
            gap: 1rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .stat-label {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;