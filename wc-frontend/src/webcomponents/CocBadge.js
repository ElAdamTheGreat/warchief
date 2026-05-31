// REQUIREMENT: Web Component (2pt) – Shadow DOM, observedAttributes, attributeChangedCallback

class CocBadge extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['clan-tag', 'clan-name', 'level'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render();
    }
  }

  render() {
    const clanTag = this.getAttribute('clan-tag') || '#UNKNOWN';
    const clanName = this.getAttribute('clan-name') || 'Warchief Roster';
    const level = this.getAttribute('level') || '1';

    // Shadow DOM Template with encapsulated CSS styling
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 320px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }

        .badge-container {
          background: rgba(26, 29, 40, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(244, 164, 35, 0.1);
          backdrop-filter: blur(12px);
          color: #e2e8f0;
          transition: all 0.3s ease;
        }

        .badge-container:hover {
          transform: translateY(-2px);
          border-color: rgba(244, 164, 35, 0.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(244, 164, 35, 0.2);
        }

        .shield-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #ffd700, #f4a423, #b45309);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          position: relative;
        }

        .shield-icon::after {
          content: "🛡️";
          font-size: 26px;
        }

        .info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .name {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0.02em;
          margin: 0;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .tag {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 600;
          margin: 2px 0 0 0;
        }

        .level-badge {
          display: inline-block;
          margin-top: 6px;
          background: rgba(244, 164, 35, 0.15);
          border: 1.5px solid #f4a423;
          border-radius: 6px;
          color: #ffd700;
          padding: 2px 6px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.05em;
          width: fit-content;
        }
      </style>

      <div class="badge-container">
        <div class="shield-icon"></div>
        <div class="info">
          <h4 class="name">${clanName}</h4>
          <span class="tag">${clanTag}</span>
          <span class="level-badge">CLAN LEVEL ${level}</span>
        </div>
      </div>
    `;
  }
}

// Register custom element
if (!customElements.get('coc-badge')) {
  customElements.define('coc-badge', CocBadge);
}

export default CocBadge;
