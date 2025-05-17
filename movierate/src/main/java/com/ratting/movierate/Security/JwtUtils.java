package com.ratting.movierate.Security;

import com.ratting.movierate.Model.User;
import com.ratting.movierate.ServiceImpl.UserServiceImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtUtils {

    private final UserServiceImpl userServiceImp;
    @Value("${spring.app.JwtSecret}")
    private String secret ;
    @Value("${spring.app.JwtExpirationMs}")
    private String JwtExpirationMs;

    public String extractUserName(String token)
    {
        return extractClaim(token,Claims::getSubject);
    }
    public Date extractExpiration(String token)
    {
        return extractClaim(token,Claims::getExpiration);
    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(secret).build().parseClaimsJws(token).getBody();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean validateToken(String authToken)
    {
        try{
            Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(authToken);
            if (isTokenExpired(authToken))
            {
                return false;
            }
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createRefreshToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 5  ))
                .signWith(SignatureAlgorithm.HS256, secret).compact();
    }

    private String createRefreshToken(Map<String, Object> claims, String subject) {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                .signWith(SignatureAlgorithm.HS256, secret).compact();
    }
    private Key key()
    {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String getJwtFromHeader(HttpServletRequest httpRequest)
    {
        String bearerToken=httpRequest.getHeader("Authorization");
        if (bearerToken!=null&&bearerToken.startsWith("Bearer "))
        {
            return bearerToken.substring(7);
        }
        return null;
    }
    public User getUserfromRequest(HttpServletRequest request)
    {
        String jwt =getJwtFromHeader(request);
        String username=extractUserName(jwt);
        User user=userServiceImp.getUserByUserName(username);
        if(user!=null)
            return user;
        return null;
    }
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }


}
