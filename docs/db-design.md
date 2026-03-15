# Database Design Documentation

## Users
Stores all registered users (Readers, Authors, Admins) with authentication details and role information.

## OTPs
Manages one-time passwords for email/phone verification during signup or login.

## Authors
Holds extended details for users applying to become authors, including biography and approval status.

## Books
Catalog of all books with metadata, inventory counts, and secure PDF references.

## Book Submissions
Tracks manuscripts submitted by authors, pending admin approval.

## Rentals
Records the lifecycle of physical book rentals (request, dispatch, return, completion).

## Wishlists
Stores books added to a user’s wishlist.

## Reviews
Contains user ratings and reviews for books, with admin moderation support.
