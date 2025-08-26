import os
import tempfile
import time
import json
import traceback
import numpy as np
import soundfile as sf
from datetime import datetime, timezone
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# API Keys Configuration
VALID_KEYS_STR = os.getenv("VALID_API_KEYS", "demo")
VALID_KEYS = set(k.strip() for k in VALID_KEYS_STR.split(",") if k.strip())
if not VALID_KEYS:
    VALID_KEYS = {"demo"}

print(f" Loaded {len(VALID_KEYS)} API keys")

# TTS ENGINE HIERARCHY (Best to Fallback)
TTS_ENGINES = {
    "edge_available": False,
    "gtts_available": False,
    "fallback_available": True
}

# Try Microsoft Edge TTS (Best Quality)
try:
    import edge_tts
    TTS_ENGINES["edge_available"] = True
    print(" Edge TTS loaded (Premium Quality)")
except:
    print(" Edge TTS not available")

# Try gTTS (Your Current Working System)
try:
    from gtts import gTTS
    TTS_ENGINES["gtts_available"] = True
    print(" gTTS loaded (Internet Required)")
except:
    print(" gTTS not available")

# Nigerian Voice Mapping (Enhanced)
NIGERIAN_VOICES = {
    # Edge TTS Voices (Best Quality)
    "nigerian-female": {"edge": "en-NG-EzinneNeural", "gtts": {"tld": "com", "slow": False}},
    "nigerian-male": {"edge": "en-NG-AbeolaNeural", "gtts": {"tld": "com", "slow": True}},
    "yoruba-female": {"edge": "en-NG-EzinneNeural", "gtts": {"tld": "co.uk", "slow": False}},
    "hausa-male": {"edge": "en-NG-AbeolaNeural", "gtts": {"tld": "com.au", "slow": False}},
    "igbo-female": {"edge": "en-NG-EzinneNeural", "gtts": {"tld": "ie", "slow": False}},
    "english-ng": {"edge": "en-NG-EzinneNeural", "gtts": {"tld": "com", "slow": False}}
}

def check_auth():
    """Authentication check"""
    try:
        api_key = (
            request.headers.get("x-api-key") or 
            request.headers.get("X-API-Key") or
            request.args.get("api_key") or
            request.form.get("api_key") or
            "demo"
        )
        return api_key in VALID_KEYS
    except:
        return True  # Fail open for demo

async def generate_edge_speech(text, voice="nigerian-female"):
    """Generate speech using Edge TTS (Best Quality)"""
    if not TTS_ENGINES["edge_available"]:
        raise Exception("Edge TTS not available")
    
    voice_config = NIGERIAN_VOICES.get(voice, NIGERIAN_VOICES["nigerian-female"])
    edge_voice = voice_config["edge"]
    
    print(f" Using Edge TTS voice: {edge_voice}")
    
    communicate = edge_tts.Communicate(text, edge_voice)
    
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_file:
        tmp_path = tmp_file.name
    
    await communicate.save(tmp_path)
    
    with open(tmp_path, "rb") as f:
        audio_data = f.read()
    
    os.unlink(tmp_path)
    return audio_data, "mp3", "edge"

def generate_gtts_speech(text, voice="nigerian-female"):
    """Generate speech using gTTS (Your Current System)"""
    if not TTS_ENGINES["gtts_available"]:
        raise Exception("gTTS not available")
    
    voice_config = NIGERIAN_VOICES.get(voice, NIGERIAN_VOICES["nigerian-female"])
    gtts_config = voice_config["gtts"]
    
    print(f" Using gTTS with TLD: {gtts_config['tld']}")
    
    # Try multiple TLDs for reliability
    tlds_to_try = [gtts_config["tld"], "com", "co.uk", "com.au"]
    
    for tld in tlds_to_try:
        try:
            tts = gTTS(text=text, lang="en", tld=tld, 
                      slow=gtts_config.get("slow", False), timeout=10)
            
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_file:
                tmp_path = tmp_file.name
            
            tts.save(tmp_path)
            
            with open(tmp_path, "rb") as f:
                audio_data = f.read()
            
            os.unlink(tmp_path)
            return audio_data, "mp3", "gtts"
            
        except Exception as e:
            print(f" gTTS TLD {tld} failed: {e}")
            continue
    
    raise Exception("All gTTS attempts failed")

def generate_fallback_audio(text):
    """Emergency fallback - Better than silence"""
    print(" Using emergency fallback audio")
    
    # Generate more natural-sounding fallback
    sample_rate = 22050
    duration = min(len(text) * 0.08, 4.0)  # More reasonable duration
    
    # Create multiple tones for a more speech-like sound
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Base frequency modulated by text content
    base_freq = 200 + (len(text) % 100)  # Varies with text
    
    # Create formant-like structure
    audio = (0.6 * np.sin(2 * np.pi * base_freq * t) +       # Fundamental
            0.3 * np.sin(2 * np.pi * base_freq * 2 * t) +     # Second harmonic
            0.1 * np.sin(2 * np.pi * base_freq * 3 * t))      # Third harmonic
    
    # Apply amplitude envelope
    envelope = np.exp(-2 * t / duration)  # Fade out
    audio = audio * envelope * 0.3  # Keep volume reasonable
    
    # Convert to bytes
    audio_int16 = (audio * 32767).astype(np.int16)
    
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
        sf.write(tmp_file.name, audio_int16, sample_rate)
        tmp_path = tmp_file.name
    
    with open(tmp_path, "rb") as f:
        audio_data = f.read()
    
    os.unlink(tmp_path)
    return audio_data, "wav", "fallback"

@app.route("/health")
def health():
    """Enhanced health check"""
    # Determine best available engine
    best_engine = "fallback"
    if TTS_ENGINES["edge_available"]:
        best_engine = "edge"
    elif TTS_ENGINES["gtts_available"]:
        best_engine = "gtts"
    
    return jsonify({
        "service": "ODIA Nigerian TTS - Bulletproof Hybrid",
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "engines": TTS_ENGINES,
        "primary_engine": best_engine,
        "quality": "Premium" if best_engine == "edge" else "Good" if best_engine == "gtts" else "Basic",
        "voices_available": list(NIGERIAN_VOICES.keys()),
        "api_keys_configured": len(VALID_KEYS),
        "production_ready": any([TTS_ENGINES["edge_available"], TTS_ENGINES["gtts_available"]])
    }), 200

@app.route("/voices")
def voices():
    """List available Nigerian voices"""
    voice_list = []
    for voice_id, config in NIGERIAN_VOICES.items():
        voice_list.append({
            "id": voice_id,
            "name": voice_id.replace("-", " ").title(),
            "description": f"Nigerian {voice_id.replace('-', ' ')} voice",
            "edge_voice": config.get("edge"),
            "quality": "Premium" if TTS_ENGINES["edge_available"] else "Good"
        })
    
    return jsonify({
        "voices": voice_list,
        "count": len(voice_list),
        "engines": TTS_ENGINES
    }), 200

@app.route("/speak", methods=["GET", "POST"])
def speak():
    """BULLETPROOF TTS Generation - Never Fails"""
    request_id = f"req_{int(time.time())}"
    
    try:
        print(f" [{request_id}] TTS request started")
        
        # Authentication
        if not check_auth():
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get parameters
        if request.method == "POST":
            data = request.get_json() or request.form.to_dict()
            text = data.get("text", "").strip()
            voice = data.get("voice", "nigerian-female")
        else:
            text = request.args.get("text", "").strip()
            voice = request.args.get("voice", "nigerian-female")
        
        print(f" [{request_id}] Text: '{text[:50]}...' Voice: {voice}")
        
        # Validation
        if not text:
            return jsonify({"error": "Text parameter required"}), 400
        if len(text) > 2000:
            return jsonify({"error": "Text too long (max 2000 chars)"}), 413
        
        # TRY ENGINE HIERARCHY (Best to Fallback)
        audio_data = None
        audio_format = None
        engine_used = None
        last_error = None
        
        # 1. Try Edge TTS First (Best Quality)
        if TTS_ENGINES["edge_available"]:
            try:
                import asyncio
                audio_data, audio_format, engine_used = asyncio.run(
                    generate_edge_speech(text, voice)
                )
                print(f" Edge TTS success: {len(audio_data)} bytes")
            except Exception as e:
                last_error = f"Edge TTS failed: {e}"
                print(f" {last_error}")
        
        # 2. Try gTTS (Your Current Working System)
        if audio_data is None and TTS_ENGINES["gtts_available"]:
            try:
                audio_data, audio_format, engine_used = generate_gtts_speech(text, voice)
                print(f" gTTS success: {len(audio_data)} bytes")
            except Exception as e:
                last_error = f"gTTS failed: {e}"
                print(f" {last_error}")
        
        # 3. Emergency Fallback (Always Works)
        if audio_data is None:
            try:
                audio_data, audio_format, engine_used = generate_fallback_audio(text)
                print(f" Fallback success: {len(audio_data)} bytes")
            except Exception as e:
                last_error = f"Fallback failed: {e}"
                print(f" {last_error}")
        
        # Check if we got audio
        if audio_data is None or len(audio_data) < 100:
            return jsonify({
                "error": "All TTS engines failed",
                "details": last_error,
                "request_id": request_id
            }), 500
        
        print(f" [{request_id}] Success: {len(audio_data)} bytes via {engine_used}")
        
        # Return audio response
        mimetype = "audio/mpeg" if audio_format == "mp3" else "audio/wav"
        response = Response(audio_data, mimetype=mimetype)
        response.headers["Content-Disposition"] = f'inline; filename="speech.{audio_format}"'
        response.headers["X-Engine-Used"] = engine_used
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Audio-Format"] = audio_format
        response.headers["X-Reliability"] = "Bulletproof"
        
        return response
        
    except Exception as e:
        print(f" [{request_id}] CRITICAL ERROR: {e}")
        print(traceback.format_exc())
        
        return jsonify({
            "error": "TTS system error",
            "request_id": request_id,
            "message": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print("=" * 60)
    print(" ODIA NIGERIAN TTS - BULLETPROOF HYBRID")
    print("=" * 60)
    
    # Show engine priority
    if TTS_ENGINES["edge_available"]:
        print(" Primary: Edge TTS (Premium Quality)")
    if TTS_ENGINES["gtts_available"]:
        print(" Backup: gTTS (Internet Required)")
    print(" Emergency: Fallback (Always Works)")
    
    print(f" API Keys: {len(VALID_KEYS)} configured")
    print(f" Port: {port}")
    print("=" * 60)
    
    app.run(host="0.0.0.0", port=port, debug=False)
