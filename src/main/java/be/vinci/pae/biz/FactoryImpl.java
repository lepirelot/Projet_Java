package be.vinci.pae.biz;

public class FactoryImpl implements Factory {

  @Override
  public Member getMember() {
    return new MemberImpl();
  }

  @Override
  public Item getItem() {
    return new ItemImpl();
  }
}
