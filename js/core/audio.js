export class SyntheticAudio {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.nodes = {};
    }

    // New Futuristic UI SFX Engine
    playSFX(type) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        const now = this.ctx.currentTime;
        if (type === 'hover') {
            // High pitched sci-fi blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'click') {
            // Deeper confirmation scanner click
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    }

    createNoiseNode(type) {
        // Binaural Beats Generation
        if (type.startsWith('binaural')) {
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            
            osc1.frequency.value = 200; // Left ear base freq
            
            if (type === 'binaural-gamma') osc2.frequency.value = 240; 
            if (type === 'binaural-alpha') osc2.frequency.value = 210; 
            if (type === 'binaural-delta') osc2.frequency.value = 202; 

            osc1.type = 'sine';
            osc2.type = 'sine';
            
            const pannerLeft = this.ctx.createStereoPanner();
            pannerLeft.pan.value = -1;
            const pannerRight = this.ctx.createStereoPanner();
            pannerRight.pan.value = 1;
            
            osc1.connect(pannerLeft);
            osc2.connect(pannerRight);
            
            const gainNode = this.ctx.createGain();
            gainNode.gain.value = 0.2; // base volume
            
            pannerLeft.connect(gainNode);
            pannerRight.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            
            return {
                source: {
                    start: () => { osc1.start(); osc2.start(); },
                    stop: () => { osc1.stop(); osc2.stop(); }
                },
                gain: gainNode
            };
        }

        // Noise Generation (Brown, Pink, White)
        const bufferSize = this.ctx.sampleRate * 4; 
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        
        let lastOut = 0;
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            
            if (type === 'brown') {
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; 
            } else if (type === 'pink' || type === 'rain' || type === 'ocean' || type === 'wind') {
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            } else {
                // White noise
                output[i] = white * 0.2;
            }
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        let finalNode = noise;

        // Apply low pass filter to pink noise to simulate rainfall
        if (type === 'rain') {
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 600; 
            noise.connect(filter);
            finalNode = filter;
        }

        if (type === 'ocean') {
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1; 
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400; 
            
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 600; 
            
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();
            
            noise.connect(filter);
            finalNode = filter;
        }

        if (type === 'wind') {
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.4; 
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            filter.Q.value = 1.0; 
            
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 800; 
            
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();
            
            noise.connect(filter);
            finalNode = filter;
        }
        
        const gainNode = this.ctx.createGain();
        gainNode.gain.value = 0.2; 
        
        finalNode.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        return { source: noise, gain: gainNode };
    }

    play(type, volume = 0.2) {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.nodes[type]) {
            this.nodes[type].source.stop();
        }
        
        const node = this.createNoiseNode(type);
        node.gain.gain.value = volume;
        node.source.start();
        this.nodes[type] = node;
    }

    stop(type) {
        if (this.nodes[type]) {
            this.nodes[type].source.stop();
            delete this.nodes[type];
        }
    }

    setVolume(type, volume) {
        if (this.nodes[type]) {
            this.nodes[type].gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
        }
    }
}
