import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  type Book = {
    title : Text;
    author : Text;
    totalPages : Nat;
  };

  let books = Map.empty<Text, Book>();

  public shared ({ caller }) func initializeBook(title : Text, author : Text, totalPages : Nat) : async () {
    switch (books.get(title)) {
      case (null) {
        let book : Book = {
          title;
          author;
          totalPages;
        };
        books.add(title, book);
      };
      case (?_) { Runtime.trap("Book already exists") };
    };
  };

  public query ({ caller }) func getBook(title : Text) : async Book {
    switch (books.get(title)) {
      case (null) { Runtime.trap("Book does not exist") };
      case (?book) { book };
    };
  };

  public shared ({ caller }) func updateTitle(oldTitle : Text, newTitle : Text) : async () {
    switch (books.get(oldTitle)) {
      case (null) { Runtime.trap("Book does not exist") };
      case (?book) {
        let updatedBook = { book with title = newTitle };
        books.remove(oldTitle);
        books.add(newTitle, updatedBook);
      };
    };
  };
};
