from typing import TypedDict

import jwt


class TokenData(TypedDict):
    id: int
    role_id: int
    chinese_name: str
    student_id: str
    exp: int


def get_token_from_cookies(cookies: str) -> str | None:
    """
    Extract the auth_token from the Cookie header.

    Args:
        cookies (str): The Cookie header string.
    Returns:
        str | None: The extracted auth_token or None if not found.
    """
    for cookie in cookies.split(";"):
        if cookie.strip().startswith("auth_token="):
            return cookie.strip().split("=", 1)[1]
    return None


def decode_token(token: str, secret_key: str, algorithms: list[str]) -> TokenData:
    """
    Decode a JWT token and return the payload as a TokenData dictionary.

    Args:
        token (str): The JWT token to decode.
        secret_key (str): The secret key used to decode the token.
        algorithms (list[str]): List of algorithms to use for decoding.

    Returns:
        TokenData: The decoded token data.
    """
    try:
        payload = jwt.decode(token, secret_key, algorithms=algorithms)
        return TokenData(
            id=payload["id"],
            role_id=payload["role_id"],
            chinese_name=payload["chinese_name"],
            student_id=payload["student_id"],
            exp=payload["exp"],
        )
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
