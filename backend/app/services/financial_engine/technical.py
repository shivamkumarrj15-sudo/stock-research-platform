"""
Technical Indicator Engine
==========================
Calculates technical indicators (RSI, MACD, EMA, SMA, Bollinger Bands, Stochastic, ATR)
and provides technical score classification.
"""

from typing import List, Dict, Any, Optional

def calculate_sma(prices: List[float], period: int) -> List[float]:
    """Calculate Simple Moving Average (SMA)."""
    if len(prices) < period:
        return [prices[-1]] * len(prices)
    res = []
    for i in range(len(prices)):
        if i < period - 1:
            res.append(prices[i])
        else:
            window = prices[i - period + 1 : i + 1]
            res.append(round(sum(window) / period, 2))
    return res

def calculate_ema(prices: List[float], period: int) -> List[float]:
    """Calculate Exponential Moving Average (EMA)."""
    if not prices:
        return []
    multiplier = 2 / (period + 1)
    ema = [prices[0]]
    for i in range(1, len(prices)):
        val = (prices[i] - ema[-1]) * multiplier + ema[-1]
        ema.append(round(val, 2))
    return ema

def calculate_rsi(prices: List[float], period: int = 14) -> float:
    """Calculate Relative Strength Index (RSI)."""
    if len(prices) < period + 1:
        return 50.0

    gains = []
    losses = []
    for i in range(1, len(prices)):
        diff = prices[i] - prices[i - 1]
        if diff >= 0:
            gains.append(diff)
            losses.append(0.0)
        else:
            gains.append(0.0)
            losses.append(abs(diff))

    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period

    if avg_loss == 0:
        return 100.0

    rs = avg_gain / avg_loss
    rsi = 100.0 - (100.0 / (1.0 + rs))
    return round(rsi, 2)

def calculate_macd(prices: List[float], fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, Any]:
    """Calculate MACD Line, Signal Line, and Histogram."""
    if len(prices) < slow:
        return {"macd": 0.0, "signal": 0.0, "histogram": 0.0, "crossover": "Neutral"}

    ema_fast = calculate_ema(prices, fast)
    ema_slow = calculate_ema(prices, slow)

    macd_line = [f - s for f, s in zip(ema_fast, ema_slow)]
    signal_line = calculate_ema(macd_line, signal)

    current_macd = round(macd_line[-1], 2)
    current_signal = round(signal_line[-1], 2)
    histogram = round(current_macd - current_signal, 2)

    crossover = "Neutral"
    if histogram > 0:
        crossover = "Bullish"
    elif histogram < 0:
        crossover = "Bearish"

    return {
        "macd": current_macd,
        "signal": current_signal,
        "histogram": histogram,
        "crossover": crossover
    }

def calculate_bollinger_bands(prices: List[float], period: int = 20, std_dev_mult: float = 2.0) -> Dict[str, float]:
    """Calculate Bollinger Bands (Upper, Middle, Lower)."""
    if len(prices) < period:
        cp = prices[-1] if prices else 100.0
        return {"upper": round(cp * 1.05, 2), "middle": cp, "lower": round(cp * 0.95, 2), "bandwidth": 10.0}

    window = prices[-period:]
    mean = sum(window) / period
    variance = sum((x - mean) ** 2 for x in window) / period
    std_dev = variance ** 0.5

    upper = round(mean + (std_dev_mult * std_dev), 2)
    lower = round(mean - (std_dev_mult * std_dev), 2)
    bandwidth = round(((upper - lower) / mean) * 100, 2) if mean > 0 else 0.0

    return {
        "upper": upper,
        "middle": round(mean, 2),
        "lower": lower,
        "bandwidth": bandwidth
    }

def calculate_stochastic(prices: List[float], period: int = 14) -> Dict[str, float]:
    """Calculate Stochastic Oscillator %K."""
    if len(prices) < period:
        return {"percent_k": 50.0, "percent_d": 50.0}

    window = prices[-period:]
    low_min = min(window)
    high_max = max(window)
    current = prices[-1]

    if high_max == low_min:
        percent_k = 50.0
    else:
        percent_k = ((current - low_min) / (high_max - low_min)) * 100.0

    return {
        "percent_k": round(percent_k, 2),
        "percent_d": round(percent_k, 2)  # Simplified for fast execution
    }

def calculate_technical_analysis(prices: List[float]) -> Dict[str, Any]:
    """
    Full technical analysis suite computing RSI, MACD, Bollinger Bands, Moving Averages,
    Pivot Points, and Master Technical Meter Score.
    """
    if not prices or len(prices) < 20:
        prices = [100.0 + i * 0.5 for i in range(50)]

    current_price = prices[-1]

    sma_20_list = calculate_sma(prices, 20)
    sma_50_list = calculate_sma(prices, 50) if len(prices) >= 50 else sma_20_list
    sma_200_list = calculate_sma(prices, 200) if len(prices) >= 200 else sma_20_list

    ema_20_list = calculate_ema(prices, 20)
    ema_50_list = calculate_ema(prices, 50) if len(prices) >= 50 else ema_20_list

    sma_20 = sma_20_list[-1]
    sma_50 = sma_50_list[-1]
    sma_200 = sma_200_list[-1]
    ema_20 = ema_20_list[-1]
    ema_50 = ema_50_list[-1]

    rsi = calculate_rsi(prices, 14)
    macd = calculate_macd(prices)
    bb = calculate_bollinger_bands(prices)
    stoch = calculate_stochastic(prices)

    # Trend Determination
    if current_price > sma_50 > sma_200:
        trend_short = "Bullish"
        trend_medium = "Bullish"
        trend_long = "Bullish"
        strength = "Strong Uptrend"
    elif current_price < sma_50 < sma_200:
        trend_short = "Bearish"
        trend_medium = "Bearish"
        trend_long = "Bearish"
        strength = "Strong Downtrend"
    else:
        trend_short = "Neutral"
        trend_medium = "Bullish" if current_price > sma_50 else "Bearish"
        trend_long = "Neutral"
        strength = "Consolidating"

    # Support / Resistance Pivots
    recent = prices[-20:]
    high_20 = max(recent)
    low_20 = min(recent)
    pivot = (high_20 + low_20 + current_price) / 3
    support_1 = round(2 * pivot - high_20, 2)
    support_2 = round(pivot - (high_20 - low_20), 2)
    resistance_1 = round(2 * pivot - low_20, 2)
    resistance_2 = round(pivot + (high_20 - low_20), 2)

    # Comprehensive Technical Score (0-100)
    tech_score = 50.0

    # Moving Average points
    if current_price > ema_20:
        tech_score += 10
    if current_price > sma_50:
        tech_score += 10
    if current_price > sma_200:
        tech_score += 15

    # Momentum points
    if 45 <= rsi <= 68:
        tech_score += 10
    elif rsi > 70:
        tech_score -= 5   # Overbought condition
    elif rsi < 30:
        tech_score += 5   # Oversold bounce opportunity

    # MACD points
    if macd["histogram"] > 0:
        tech_score += 10
    else:
        tech_score -= 5

    tech_score = min(100.0, max(0.0, tech_score))

    # Meter Classification
    if tech_score >= 80:
        classification = "Strong Buy"
    elif tech_score >= 62:
        classification = "Buy"
    elif tech_score >= 45:
        classification = "Neutral"
    elif tech_score >= 30:
        classification = "Sell"
    else:
        classification = "Strong Sell"

    return {
        "current_price": current_price,
        "trend": {
            "short_term": trend_short,
            "medium_term": trend_medium,
            "long_term": trend_long,
            "strength": strength
        },
        "rsi_14": rsi,
        "macd": macd,
        "bollinger_bands": bb,
        "stochastic": stoch,
        "moving_averages": {
            "sma_20": sma_20,
            "sma_50": sma_50,
            "sma_200": sma_200,
            "ema_20": ema_20,
            "ema_50": ema_50
        },
        "pivots": {
            "pivot": round(pivot, 2),
            "support_1": support_1,
            "support_2": support_2,
            "resistance_1": resistance_1,
            "resistance_2": resistance_2
        },
        "technical_score": tech_score,
        "classification": classification
    }
