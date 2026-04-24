import urllib.parse
import logging

logger = logging.getLogger(__name__)

def generate_image_url(prompt: str) -> str:
    """
    Generate an image URL using Pollinations.ai.
    This is a free, high-speed image generation service.
    """
    if not prompt:
        return ""
    
    # URL encode the prompt
    encoded_prompt = urllib.parse.quote(prompt)
    
    # Standard Pollinations.ai URL format
    # We add some parameters for better quality and aspect ratio
    image_url = f"https://pollinations.ai/p/{encoded_prompt}?width=1024&height=1024&seed=42&nologo=true"
    
    logger.info(f"Generated image URL for prompt: {prompt}")
    return image_url
